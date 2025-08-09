<template>
  <div class="flex flex-col justify-center items-center  relative">
    <!-- Buscador -->
    <div class="w-full flex justify-center mb-4 relative">
      <div class="relative w-1/3">
        <!-- Icono de búsqueda -->
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m2.1-6.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
          </svg>
        </div>
        <!-- Campo de entrada -->
        <input v-model="searchQuery" @input="updateSearchResults" type="text" placeholder="Buscar"
          class="w-full border border-gray-300 rounded-lg px-10 py-2 text-gray-700 focus:ring-2 focus:ring-[#497fae] focus:border-[#497fae] shadow-sm" />
        <!-- Lista de resultados -->
        <ul v-if="searchResults.length > 0 && searchQuery.length > 0"
          class="absolute left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2 z-10">
          <li v-for="result in searchResults" :key="result.id" @click="selectBeaconFromSearch(result.id)"
            class="px-4 py-2 hover:bg-[#497fae] cursor-pointer flex justify-between items-center">
            <div>
              <span class="font-semibold text-gray-800">{{ result.name }}</span>
              <span class="text-gray-500 text-sm block">({{ result.identifier }})</span>
            </div>
            <span class="text-gray-400 text-sm italic">{{ result.areaName }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Vista principal -->
    <div class="flex items-center justify-center bg-gray-100 mb-5 pb-5 w-full">
      <ModalLayoutPlane v-if="selectedLayout" :key="selectedLayout._id" :name="selectedLayout.name"
        :backgroundimage="selectedLayout.backgroundImage" :areas="selectedLayout.areas"
        :highlightedBeacon="highlightedBeacon" @highlight="highlightBeacon" />
    </div>

    <!-- Bolas laterales con Vuetify tooltips -->
    <div class="fixed top-1/2 right-5 transform -translate-y-1/2 flex flex-col items-center space-y-4 ">
      <v-tooltip v-for="(layout, index) in layouts" :key="layout._id" :text="layout.name">
        <template v-slot:activator="{ props }">
          <div v-bind="props"
            class="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-transform duration-300"
            :class="{
              'bg-[#6999c2] text-white transform scale-110 shadow-lg': index === selectedIndex,
              'bg-[#bfd3e6] text-gray-700 hover:bg-[#6999c2]': index !== selectedIndex,
            }" @click="selectLayout(index)">
            {{ index + 1 }}
          </div>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { listmonitoringApi, connectMonitoringSocket, disconnectMonitoringSocket } from "@/api/MonitoringService";
import ModalLayoutPlane from "@/components/monitoring/ModalLayoutPlane.vue";
import store from "@/store";

export default {
  components: {
    ModalLayoutPlane,
  },
  setup() {
    const layouts = ref([]);
    const selectedIndex = ref(0);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const highlightedBeacon = ref(null);
    const token = store.state.token;
    const customerId = store.state.customerid;

    const highlightBeacon = (id) => {
      highlightedBeacon.value = id;
      setTimeout(() => {
        highlightedBeacon.value = null;
      }, 10000);
    };

    const fetchMonitoringData = async () => {
      try {
        const response = await listmonitoringApi(token);
        layouts.value = response.data.data.map((layout) => ({
          ...layout,
          areas: layout.areas.map((area) => ({
            ...area,
            items: area.items.map((beacon) => ({
              ...beacon,
              areaName: area.name,
              layoutId: layout._id,
            })),
          })),
        }));
        connectMonitoringSocket(handleMonitoringUpdate, handleSocketError, customerId);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
      }
    };

    const handleMonitoringUpdate = (data) => {
      layouts.value = data;
    };

    const handleSocketError = (error) => {
      console.error("Error en la conexión de Socket.IO:", error);
    };

    const updateSearchResults = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();

  const allBeacons = layouts.value.flatMap((layout) =>
    layout.areas.flatMap((area) =>
      area.items.map((beacon) => ({
        ...beacon,
        areaName: area.name,
        layoutId: layout._id,
      }))
    )
  );

  searchResults.value = allBeacons
    .filter(
      (beacon) =>
        beacon.name.toLowerCase().includes(query) || // Filtra por nombre
        (beacon.identifier && beacon.identifier.toLowerCase().includes(query)) // Filtra por identificador
    )
    .map((beacon) => ({
      id: beacon._id,
      name: beacon.name,
      identifier: beacon.identifier || "N/A",
      areaName: beacon.areaName,
      layoutId: beacon.layoutId,
    }));
};


    const selectBeaconFromSearch = (id) => {
      const beacon = layouts.value
        .flatMap((layout) => layout.areas.flatMap((area) => area.items))
        .find((beacon) => beacon._id === id);

      if (beacon) {
        const layoutIndex = layouts.value.findIndex(
          (layout) => layout._id === beacon.layoutId
        );
        if (layoutIndex !== -1) {
          selectedIndex.value = layoutIndex;
        }
        highlightBeacon(beacon._id);
      }

      searchQuery.value = "";
      searchResults.value = [];
    };

    const selectedLayout = computed(() => layouts.value[selectedIndex.value]);

    const selectLayout = (index) => {
      selectedIndex.value = index;
    };

    onMounted(fetchMonitoringData);

    onUnmounted(() => {
      disconnectMonitoringSocket();
    });

    return {
      layouts,
      selectedLayout,
      selectedIndex,
      selectLayout,
      searchQuery,
      searchResults,
      updateSearchResults,
      selectBeaconFromSearch,
      highlightBeacon,
      highlightedBeacon,
    };
  },
};
</script>

<style scoped>
/* Personaliza la apariencia del tooltip o lista desplegable según sea necesario */
</style>
