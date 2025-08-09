<template>
    <div>
        <!-- Filtros de fecha -->
        <div class="flex items-center space-x-2 p-2 bg-gray-50 shadow rounded-lg mb-3">
            <!-- Fecha Desde -->
            <div class="w-1/3">
                <label for="start-date" class="block text-sm font-medium text-gray-700">Desde</label>
                <input id="start-date" type="datetime-local" v-model="startDate"
                    class="mt-2 block w-full h-10 border-gray-300 rounded-lg bg-[#bfd3e6] p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
            </div>

            <!-- Fecha Hasta -->
            <div class="w-1/3">
                <label for="end-date" class="block text-sm font-medium text-gray-700">Hasta</label>
                <input id="end-date" type="datetime-local" v-model="endDate"
                    class="mt-2 block w-full h-10 border-gray-300 rounded-lg bg-[#bfd3e6] p-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
            </div>

            <!-- Dropdowns dinámicos con checkboxes y resumen de selección -->
            <div class="w-1/3 relative" v-for="(dropdown, index) in dropdowns" :key="index">
                <label :for="'select-option-' + index" class="block text-sm font-medium text-gray-700">
                    {{ dropdown.label }}
                </label>
                <div class="relative">
                    <!-- Botón con resumen de selección -->
                    <button @click="toggleDropdown(index)"
                        class="mt-2 block w-full h-10 px-4 bg-[#bfd3e6] border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-left truncate">
                        {{ getSelectedText(index) }}
                    </button>
                    <div v-if="dropdown.open"
                        class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60">
                        <!-- Buscador -->
                        <div class="p-3">
                            <label for="input-group-search" class="sr-only">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="text" id="input-group-search" v-model="dropdown.searchTerm"
                                    class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-#497fae-500 focus:border-#497fae-500 bg-white-600 border-gray-500 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-#497fae-500 dark:focus:border-#497fae-500"
                                    placeholder="Buscar">
                            </div>
                        </div>

                        <!-- Lista de opciones -->
                        <ul class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-600">
                            <!-- Opción "Todos" -->
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                                <input type="checkbox" :checked="dropdown.selectedIds.includes('ALL')"
                                    @change="toggleSelectAll(index)" class="mr-2" />
                                Todos
                            </li>
                            <!-- Opciones filtradas -->
                            <li v-for="item in filteredData(index)" :key="item._id"
                                class="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" :value="item._id" v-model="dropdown.selectedIds"
                                    :disabled="dropdown.selectedIds.includes('ALL')" class="mr-2" />
                                {{ item.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- Botones de Buscar y Exportar -->
            <div class="flex space-x-2 w-1/6 mt-6">
                <button @click="validateAndEmitFilter"
                    class="w-1/2 h-10 bg-[#396895] text-white font-semibold rounded-lg shadow-md hover:bg-[#396895] focus:outline-none focus:ring-2 focus:ring-[#497fae] focus:ring-opacity-75 mdi mdi-magnify text-xl"></button>
                <button @click="emitExportEvent"
                    class="w-1/2 h-10 bg-[#099cb4] text-white font-semibold rounded-lg shadow-md hover:bg-#099cb4-600 focus:outline-none focus:ring-2 focus:ring-#099cb4-400 focus:ring-opacity-75 mdi mdi-microsoft-excel text-xl"></button>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { eventBus } from "@/utils/eventBus"; // Importar el bus de eventos
import { listTagApi } from "@/api/TagService";
import { listGTagsApi } from "@/api/GTagService";
import { listAreasApi } from "@/api/AreaService";
import { listGAreasApi } from "@/api/GAreaService";
import store from "@/store";

export default {
    setup(_, { emit }) {
        const startDate = ref("");
        const endDate = ref("");

        // Configuración de dropdowns
        const dropdowns = ref([
            { label: "Etiquetas", fetchData: listTagApi, data: [], selectedIds: [], open: false, searchTerm: "" },
            { label: "G. Etiquetas", fetchData: listGTagsApi, data: [], selectedIds: [], open: false, searchTerm: "" },
            { label: "Área", fetchData: listAreasApi, data: [], selectedIds: [], open: false, searchTerm: "" },
            { label: "G. Áreas", fetchData: listGAreasApi, data: [], selectedIds: [], open: false, searchTerm: "" },
        ]);
        const token = store.state.token;

        const getSelectedText = (index) => {
        const dropdown = dropdowns.value[index];
        if (!dropdown.selectedIds.length) return "Seleccionar";
        if (dropdown.selectedIds.includes("ALL")) return "Todos seleccionados";

        const selectedNames = dropdown.data
            .filter(item => dropdown.selectedIds.includes(item._id))
            .map(item => item.name);

        if (selectedNames.length <= 2) return selectedNames.join(", ");
        return `${selectedNames.slice(0, 2).join(", ")} y ${selectedNames.length - 2} más`;
    };


        const getStartAndEndOfDayUTC5 = () => {
            const now = new Date();
            const utcOffset = -5 * 60;

            // Ajustar a UTC-5
            const localTime = new Date(now.getTime() + utcOffset * 60 * 1000);

            // Inicio del día
            const startOfDay = new Date(localTime.setUTCHours(0, 0, 0, 0));
            const formattedStartOfDay = startOfDay.toISOString().slice(0, 19);

            // Fin del día
            const endOfDay = new Date(localTime.setUTCHours(23, 59, 0, 0));
            const formattedEndOfDay = endOfDay.toISOString().slice(0, 19);

            return { dateFrom: formattedStartOfDay, dateTo: formattedEndOfDay };
        };

        // Establecer fechas iniciales al montar
        onMounted(() => {
            const { dateFrom, dateTo } = getStartAndEndOfDayUTC5();
            startDate.value = dateFrom;
            endDate.value = dateTo;
        });

        // Alternar apertura del dropdown
        const toggleDropdown = async (index) => {
            const dropdown = dropdowns.value[index];
            if (!dropdown.data.length) {
                try {
                    const response = await dropdown.fetchData(token);
                    dropdown.data = response.data.data || [];
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
            dropdown.open = !dropdown.open;
        };

        // Filtrar datos según el término de búsqueda
        const filteredData = (index) => {
            const searchTerm = dropdowns.value[index].searchTerm.toLowerCase();
            return dropdowns.value[index].data.filter((item) =>
                item.name.toLowerCase().includes(searchTerm)
            );
        };

        // Lógica para seleccionar/deseleccionar "Todos"
        const toggleSelectAll = (index) => {
            const dropdown = dropdowns.value[index];
            if (dropdown.selectedIds.includes("ALL")) {
                dropdown.selectedIds = [];
            } else {
                dropdown.selectedIds = ["ALL"];
            }
        };

        // Validar fechas y emitir el filtro
        const validateAndEmitFilter = () => {
            if (!startDate.value || !endDate.value) {
                Swal.fire({
                    icon: "error",
                    title: "Fechas incompletas",
                    text: "Por favor, selecciona ambas fechas.",
                });
                return;
            }

            // Generar los datos
            const filterData = {
                dateFrom: startDate.value,
                dateTo: endDate.value,
                mobile_items: dropdowns.value[0].selectedIds.length ? dropdowns.value[0].selectedIds : [],
                group_mobile_items: dropdowns.value[1].selectedIds.length ? dropdowns.value[1].selectedIds : [],
                areas: dropdowns.value[2].selectedIds.length ? dropdowns.value[2].selectedIds : [],
                group_areas: dropdowns.value[3].selectedIds.length ? dropdowns.value[3].selectedIds : [],
            };

            console.log("Emitting filter data:", filterData);
            emit("apply", filterData);

            // Cerrar todos los dropdowns
            dropdowns.value.forEach((dropdown) => {
                dropdown.open = false;
            });
        };

        // Emitir evento global de exportación
        const emitExportEvent = () => {
            const exportData = {
                dateFrom: startDate.value,
                dateTo: endDate.value,
                mobile_items: dropdowns.value[0].selectedIds.length ? dropdowns.value[0].selectedIds : [""],
                group_mobile_items: dropdowns.value[1].selectedIds.length ? dropdowns.value[1].selectedIds : [""],
                areas: dropdowns.value[2].selectedIds.length ? dropdowns.value[2].selectedIds : [""],
                group_areas: dropdowns.value[3].selectedIds.length ? dropdowns.value[3].selectedIds : [""],
            };

            console.log("Emitting export data:", exportData);
            eventBus.emit("export-requested", exportData); // Emitir evento global
        };

        return {
            startDate,
            endDate,
            dropdowns,
            toggleDropdown,
            filteredData,
            toggleSelectAll,
            validateAndEmitFilter,
            emitExportEvent,
            getSelectedText
        };
    },
};
</script>

<style scoped>
ul {
    max-height: 200px;
    overflow-y: auto;
}
</style>