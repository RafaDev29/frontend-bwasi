<template>
  <div class="flex justify-center items-center h-screen h-full relative">
    <div class="flex items-center justify-center bg-gray-100 mb-5 pb-5">
      <ModalLayoutPlane v-if="selectedLayout" :key="selectedLayout._id" :name="selectedLayout.name"
        :backgroundimage="selectedLayout.backgroundImage" :areas="selectedLayout.areas" @uploadPlans="openUploadModal"
        @areaSelected="selectCoordinates" />
    </div>

    <!-- Bolas laterales con Vuetify tooltips -->
    <div class="fixed top-1/2 right-5 transform -translate-y-1/2 flex flex-col items-center space-y-4">
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

    <!-- Modal para cargar plano -->
    <UploadPlanModal v-if="showUploadModal" :layoutId="selectedLayout._id" @close="showUploadModal = false"
      @imageUploaded="handleImageUpload" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { listLayoutApi, uploadLayoutApi } from "@/api/LayoutService";
import { coordinatesAreaApi } from "@/api/AreaService";
import ModalLayoutPlane from "@/components/plans/ModalLayoutPlane.vue";
import UploadPlanModal from "@/components/plans/UploadPlanModal.vue";
import store from "@/store";

export default {
  components: {
    ModalLayoutPlane,
    UploadPlanModal,
  },
  setup() {
    const layouts = ref([]);
    const selectedIndex = ref(0);
    const error = ref(null);
    const showUploadModal = ref(false);
    const token = store.state.token;

    const listLayouts = async () => {
      try {
        const response = await listLayoutApi(token);
        if (response && response.data && response.data.data) {
          layouts.value = response.data.data;
        } else {
          error.value = response.data.message || "Error al cargar los layouts";
        }
      } catch (err) {
        error.value = "Error al conectar con el servidor. Por favor, inténtalo de nuevo.";
      }
    };

    const openUploadModal = () => {
      showUploadModal.value = true;
    };

    const handleImageUpload = async (formData, id) => {
      try {
        const response = await uploadLayoutApi(token, formData, id);
        if (response) {
          await listLayouts();
        }
      } catch (error) {
        console.error("error al cargar plano");
      }
    };

    const selectCoordinates = async (data) => {
      const payload = { coordinates: data.coordinates };

      try {
        const response = await coordinatesAreaApi(token, payload, data.id);
        if (response) {
          await listLayouts();
        }
      } catch (error) {
        console.error("error al crear area");
      }
    };

    const selectLayout = (index) => {
      selectedIndex.value = index;
    };

    onMounted(listLayouts);

    const selectedLayout = computed(() => {
      const layout = layouts.value[selectedIndex.value];
      return {
        ...layout,
        areas: layout ? layout.areas : [],
      };
    });

    return {
      layouts,
      selectedLayout,
      selectedIndex,
      showUploadModal,
      openUploadModal,
      handleImageUpload,
      selectLayout,
      selectCoordinates,
    };
  },
};
</script>

<style scoped>
.tooltip {
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
}
</style>
