<template>
    <div class="relative p-6">
        <!-- Encabezado -->
        <div class="flex justify-between items-center">
            <h1 class="font-bold lg:text-2xl text-xl text-gray-500 mb-5"> Monitoreo en tiempo real</h1>

        </div>

        <!-- Buscador -->
        <div class="relative mb-6">
            <div class="relative">
                <!-- Ícono -->
                <i class="mdi mdi-magnify  absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

                <!-- Campo de entrada -->
                <input v-model="searchQuery" @input="updateSearchResults" type="text" placeholder="Buscar"
                    class="w-full border border-gray-300 rounded-lg pl-10 py-2 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500" />
            </div>

            <!-- Lista de coincidencias -->
            <ul v-if="searchResults.length > 0 && searchQuery.length > 0"
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow mt-1">
                <li v-for="result in searchResults" :key="result.id" @click="selectBeaconFromSearch(result.id)"
                    class="px-4 py-2 hover:bg-#497fae-100 cursor-pointer flex justify-between">
                    <div>
                        <span class="font-bold">{{ result.name }}</span>
                        <span class="text-gray-500 text-sm block">({{ result.identifier }})</span>
                    </div>
                    <span class="text-gray-500 text-sm">{{ result.areaName }}</span>
                </li>
            </ul>



        </div>

        <!-- Indicadores de Estado -->
        <div v-if="loading" class="text-center text-gray-500">
            <p>Cargando datos de monitoreo...</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500">
            <p>Error al cargar datos: {{ error }}</p>
        </div>

        <!-- Datos Filtrados -->
        <div v-else>
            <div v-if="filteredLayouts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <MonitoringLayout v-for="layout in filteredLayouts" :key="layout._id" :layout="layout"
                    @beaconSelected="selectBeacon" :highlightedBeacon="highlightedBeacon" />
            </div>
            <div v-else class="text-center text-gray-500 text-sm mt-6">
                No se encontraron coincidencias con la búsqueda.
            </div>
        </div>

        <transition name="slide" mode="out-in">
            <div v-if="selectedBeacon"
                class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col">
                <!-- Header -->
                <div class="p-6 border-b border-gray-300 flex justify-between items-center bg-primary">
                    <h2 class="text-lg font-semibold text-white">{{ selectedBeacon.name }}</h2>
                    <button @click="closePanel"
                        class="text-white hover:text-red-200 transition transform hover:scale-110">
                        ✕
                    </button>
                </div>
                <!-- Content -->
                <div class="p-6 space-y-6 flex-1 overflow-y-auto bg-gray-50">
                    <!-- Detail Items -->
                    <div class="p-4 bg-white shadow rounded-lg">
                        <p class="text-sm text-gray-600"><strong class="font-medium text-gray-900">Identificador:</strong> {{
                            selectedBeacon.identifier }}</p>
                    </div>
                    
                    <div class="p-4 bg-white shadow rounded-lg">
                        <p class="text-sm text-gray-600"><strong class="font-medium text-gray-900">Apoderado:</strong>
                            {{
                                selectedBeacon.proxyName }}</p>
                    </div>
                    <div class="p-4 bg-white shadow rounded-lg">
                        <p class="text-sm text-gray-600"><strong class="font-medium text-gray-900">Email:</strong> {{
                            selectedBeacon.proxyEmail }}</p>
                    </div>
                    <div class="p-4 bg-white shadow rounded-lg">
                        <p class="text-sm text-gray-600"><strong class="font-medium text-gray-900">Teléfono:</strong> {{
                            selectedBeacon.proxyPhone }}</p>
                    </div>
                </div>

            </div>
        </transition>

    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { listmonitoringApi, connectMonitoringSocket, disconnectMonitoringSocket } from "@/api/MonitoringService";
import store from "@/store";
import MonitoringLayout from "@/components/monitoringv1/MonitoringLayout.vue";

export default {
    name: "MonitoringView",
    components: {
        MonitoringLayout,
    },
    setup() {
        const highlightedBeacon = ref(null);
        const loading = ref(false);
        const error = ref(null);
        const layouts = ref([]);
        const selectedBeacon = ref(null);
        const searchQuery = ref("");
        const searchResults = ref([]);
        const selectedSearchResult = ref("");


        const handleMonitoringUpdate = (data) => {
            layouts.value = data; // Actualiza los datos en tiempo real
        };

        // Función para manejar errores de Socket.IO
        const handleSocketError = (error) => {
            console.error("Error en la conexión de Socket.IO:", error);
        };

        // Función para cargar datos iniciales
        const fetchMonitoringData = async () => {
            loading.value = true;
            error.value = null;
            try {
                const token = store.state.token; // Obtén el token de Vuex
                const response = await listmonitoringApi(token); // Llama al servicio REST
                layouts.value = response.data.data.map(layout => ({
                    ...layout,
                    areas: layout.areas.map(area => ({
                        ...area,
                        items: area.items.map(beacon => ({
                            ...beacon,
                            areaId: area._id, // Agregar el ID del área al beacon
                        })),
                    })),
                }));
                const customerId = store.state.customerid
                // Conectar al servidor de Socket.IO después de cargar datos iniciales
                connectMonitoringSocket(handleMonitoringUpdate, handleSocketError, customerId);
            } catch (err) {
                console.error("Error al obtener datos de monitoreo:", err);
                error.value = err.message || "Error desconocido";
            } finally {
                loading.value = false;
            }
        };

        // Actualiza los resultados de búsqueda
        const updateSearchResults = () => {
            if (!searchQuery.value.trim()) {
                searchResults.value = [];
                selectedSearchResult.value = "";
                return;
            }
            const query = searchQuery.value.toLowerCase();

            const allBeacons = layouts.value.flatMap(layout =>
                layout.areas.flatMap(area =>
                    area.items.map(beacon => ({
                        ...beacon,
                        areaName: area.name, // Incluye el nombre del área
                    }))
                )
            );

            searchResults.value = allBeacons.filter(beacon =>
                beacon.name.toLowerCase().includes(query) ||
                beacon.identifier.toLowerCase().includes(query) // Agregar búsqueda por identifier
            ).map(beacon => ({
                id: beacon._id,
                name: beacon.name,
                identifier: beacon.identifier, // Agregar identifier a los resultados
                areaName: beacon.areaName,
            }));
        };


        // Filtra los layouts según el beacon seleccionado en los resultados de búsqueda
        const filteredLayouts = computed(() => {
            if (!selectedSearchResult.value.trim()) {
                return layouts.value;
            }
            const query = selectedSearchResult.value.toLowerCase();
            return layouts.value
                .map((layout) => ({
                    ...layout,
                    areas: layout.areas.map((area) => ({
                        ...area,
                        items: area.items.filter((beacon) =>
                            beacon.name.toLowerCase() === query
                        ),
                    })).filter((area) => area.items.length > 0),
                }))
                .filter((layout) => layout.areas.length > 0);
        });

        // Selecciona un beacon desde la búsqueda
        const selectBeaconFromSearch = (id) => {
            const beacon = layouts.value
                .flatMap(layout => layout.areas.flatMap(area => area.items))
                .find(beacon => beacon._id === id);

            if (beacon) {
                // Resaltar el beacon
                highlightedBeacon.value = beacon._id;

                // Buscar la referencia del área donde está el beacon
                const areaElement = document.querySelector(`[ref="area-${beacon.areaId}"]`); // Usa el ID del área
                if (areaElement) {
                    // Realizar el scroll suave hacia el área
                    areaElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }

                // Limpiar el resaltado después de un tiempo
                setTimeout(() => (highlightedBeacon.value = null), 10000);
            }

            // Limpiar búsqueda
            searchQuery.value = "";
            searchResults.value = [];
        };


        // Selecciona un beacon para mostrar detalles
        const selectBeacon = (beacon) => {
            selectedBeacon.value = beacon;
        };

        // Cierra el panel lateral
        const closePanel = () => {
            selectedBeacon.value = null;
        };

        onMounted(() => {
            fetchMonitoringData(); // Cargar datos iniciales al montar el componente
        });

        onUnmounted(() => {
            disconnectMonitoringSocket();
        });

        return {
            loading,
            error,
            layouts,
            selectedBeacon,
            searchQuery,
            searchResults,
            selectedSearchResult,
            filteredLayouts,
            updateSearchResults,
            selectBeaconFromSearch,
            selectBeacon,
            closePanel,
            fetchMonitoringData,
            highlightedBeacon,
        };
    },
};
</script>
