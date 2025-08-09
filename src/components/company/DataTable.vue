<template>
  <v-text-field
    v-model="search"
    label="Buscar"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    hide-details
    single-line
    class="mb-5 PT-3"
  ></v-text-field>
  <v-card flat>
    <v-data-table :headers="headers" :items="filteredItems" :search="search" density="compact"  class="ma-2" >
      <!-- Íconos en la columna de acciones -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="#099cb4" class="mr-4" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>

      <!-- Botón Ver Logo -->
      <template v-slot:[`item.logo`]="{ item }">
        <v-btn small color="primary" @click="openLogoModal(item.logo)">
          Ver Logo
        </v-btn>
      </template>
    </v-data-table>
  </v-card>

  <!-- LogoModal -->
  <LogoModal :logoUrl="currentLogo" v-model:isVisible="logoModal" />

</template>

<script>
import { ref, computed } from "vue";
import LogoModal from "@/components/company/ViewLogo.vue";

export default {
  name: "DataTable",
  components: { LogoModal },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ["deleteItem", "editItem"],
  setup(props, { emit }) {
    const search = ref("");
    const logoModal = ref(false);
    const currentLogo = ref("");

    const headers = ref([
      { key: "id", title: "ID" },
      { key: "user.username", title: "Usuario" },
      { key: "name", title: "Nombre" },
      { key: "businessName", title: "Razón social" },
      { key: "ruc", title: "RUC" },
      { key: "typeLogic", title: "Tipo de configuración" },
      { key: "logo", title: "Logo", sortable: false },
      { key: "actions", title: "Acciones", sortable: false },
    ]);

    const filteredItems = computed(() => {
      if (!search.value) {
        return indexedItems.value;
      }
      const searchTerm = search.value.toLowerCase();
      return indexedItems.value.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        )
      );
    });

    const indexedItems = computed(() => {
      return props.items.map((item, index) => ({
        id: index + 1, // Agregar índice como id
        ...item,
      }));
    });

    const deleteItem = (item) => {
      emit("deleteItem", item);
    };

    const editItem = (item) => {
      emit("editItem", item);
    };

    const openLogoModal = (logo) => {
 
      currentLogo.value = logo;
      logoModal.value = true;
    };

    return {
      search,
      headers,
      filteredItems,
      deleteItem,
      editItem,
      logoModal,
      currentLogo,
      openLogoModal,
    };
  },
};
</script>

<style scoped>
/* Estilos específicos para el componente de la tabla */
</style>
