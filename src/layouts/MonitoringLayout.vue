<template>
  <transition name="slide">
    <div v-if="isOpen"
      class="fixed top-0 right-0 w-1/4 h-full bg-white text-gray-800 shadow-lg p-6 overflow-y-auto bg-opacity-50 z-[9999]">
      <button class="relative justify-end text-[#1c9ccc] hover:text-[#1cb0c8] " @click="closePanel"> 
        <i class="mdi mdi-arrow-right-bold-circle text-3xl"></i>
      </button>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold flex items-center">
          <span class="mdi mdi-map-marker text-2xl mr-2"></span>
          {{ area.name }}
        </h2>
        <div class="flex items-center text-sm bg-gray-100 p-2 rounded-lg shadow-md">
          <span class="mdi mdi-account-group text-blue-600 mr-0"></span>
          <p class="font-semibold mr-1">Aforo:</p>
          <p class="text-gray-700">{{ area.aforo.amount }}</p>
        </div>
      </div>



      <!-- Buscador -->
      <div class="mb-6">
        <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o identificador"
          class="w-full p-2 rounded-lg border border-[#1cb0c8] focus:outline-none" />
      </div>

      <div v-if="area" class="space-y-6">

        <!-- Items agrupados por tipo -->
        <div>

          <div class="space-y-6">
            <div v-for="(items, typeId) in filteredGroupedItems" :key="typeId"
              class="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-200">
              <p class="font-semibold text-[#1cb0c8] mb-4">
                 {{ items[0].typeName }} ({{ items.length }} etiquetas)
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <div v-for="(item, index) in filteredVisibleItems[typeId]" :key="index"
                  class="p-1 rounded-sm">
                  <p class="text-sm text-gray-700"><strong>◉</strong> {{ item.name }} ({{ item.identifier }})</p>
                </div>
              </div>
              <div v-if="items.length > filteredVisibleItems[typeId].length" class="text-right mt-4">
                <button class="text-[#1cb0c8] hover:text-[#1c9ccc] text-sm font-semibold" @click="showMore(typeId)">
                  Ver más <span>&#x25BC;</span>
                </button>
              </div>
              <div v-else-if="filteredVisibleItems[typeId].length > 6" class="text-right mt-4">
                <button class="text-[#1cb0c8] hover:text-[#1c9ccc] text-sm font-semibold" @click="showLess(typeId)">
                  Ver menos <span>&#x25B2;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500">
        <p>No se seleccionó ningún área.</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { eventBus } from "@/utils/eventBus";

export default {
  setup() {
    const isOpen = ref(false);
    const area = ref(null);
    const searchQuery = ref("");
    const visibleItems = reactive({});
    const filteredVisibleItems = reactive({});

    const groupedItems = computed(() => {
      if (!area.value?.items) return {};
      return area.value.items.reduce((groups, item) => {
        if (!groups[item.typeId]) {
          groups[item.typeId] = [];
        }
        groups[item.typeId].push(item);
        return groups;
      }, {});
    });

    const filteredGroupedItems = computed(() => {
      if (!searchQuery.value) return groupedItems.value;
      const query = searchQuery.value.toLowerCase();
      const filtered = {};
      for (const [typeId, items] of Object.entries(groupedItems.value)) {
        const filteredItems = items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.identifier.toLowerCase().includes(query)
        );
        if (filteredItems.length) {
          filtered[typeId] = filteredItems;
        }
      }
      return filtered;
    });

    const initializeVisibleItems = () => {
      for (const typeId of Object.keys(groupedItems.value)) {
        visibleItems[typeId] = groupedItems.value[typeId].slice(0, 6);
      }
    };

    const updateFilteredVisibleItems = () => {
      for (const [typeId, items] of Object.entries(filteredGroupedItems.value)) {
        filteredVisibleItems[typeId] = items.slice(0, 6);
      }
    };

    const showMore = (typeId) => {
      const currentLength = filteredVisibleItems[typeId].length;
      filteredVisibleItems[typeId] = filteredGroupedItems.value[typeId].slice(0, currentLength + 6);
    };

    const showLess = (typeId) => {
      filteredVisibleItems[typeId] = filteredGroupedItems.value[typeId].slice(0, 6);
    };

    const openPanel = (receivedArea) => {
      console.log("Evento recibido:", receivedArea);
      area.value = receivedArea;
      initializeVisibleItems();
      updateFilteredVisibleItems();
      isOpen.value = true;
    };

    const closePanel = () => {
      isOpen.value = false;
      area.value = null;
    };

    watch(filteredGroupedItems, updateFilteredVisibleItems);

    onMounted(() => {
      eventBus.on("area-clicked", openPanel);
    });

    onBeforeUnmount(() => {
      eventBus.off("area-clicked", openPanel);
    });

    return {
      isOpen,
      area,
      searchQuery,
      groupedItems,
      filteredGroupedItems,
      visibleItems,
      filteredVisibleItems,
      showMore,
      showLess,
      openPanel,
      closePanel,
    };
  },
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
