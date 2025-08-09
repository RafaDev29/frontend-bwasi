<template>
  <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
    single-line class="mb-5 PT-3" density="compact"></v-text-field>
  <v-card flat>
    <v-data-table :headers="headers" :items="filteredItems" :search="search" density="compact" class="ma-2">
      <!-- Modificar cómo se renderiza la columna Paradas -->
      <template v-slot:[`item.areas`]="{ item }">
        <!-- Ícono para ver Paradas -->
        <v-icon small color="#497fae" @click="viewAntennas(item.areaPoints)">
          mdi-eye
        </v-icon>
      </template>

      <!-- Íconos en la columna de acciones -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="#099cb4" class="mr-4" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>

      <!-- Colores visuales -->
      <template v-slot:[`item.color`]="{ item }">
        <div :style="{ backgroundColor: item.color }" class="w-6 h-6 rounded-full border border-gray-300 "></div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { ref, computed } from "vue";
import store from "@/store";
export default {
  name: "DataTable",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ["deleteItem", "editItem", "viewAntennas"],
  setup(props, { emit }) {


    const dynamicTitleAreas = computed(() => store.getters.getItemName("Puntos de área"));
    const dynamicTitleLayout = computed(() =>
      store.getters.getItemName("Layouts")
    )

    const search = ref("");

    const headers = ref([
      { key: "id", title: "ID" },
      { key: "name", title: "Nombre" },
      { key: "layout.name", title: "Layout" },
      { key: "areas", title: "Antenas" },
      { key: "dwellTime", title: "T. permanencia" },
      { key: "color", title: "Color" },
      { key: "actions", title: "Acciones", sortable: false },
    ]);

    const dynamicHeaders = computed(() => {
      return headers.value.map((header) => {
        if (header.key === "areas") {
          return { ...header, title: dynamicTitleAreas.value };
        }
        if (header.key === "layout.name") {
          return { ...header, title: dynamicTitleLayout.value };
        }
        return header;
      });
    });

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

    const viewAntennas = (antennas) => {
      emit("viewAntennas", antennas);


    };

    return {
      search,
      headers: dynamicHeaders,
      filteredItems,
      deleteItem,
      editItem,
      viewAntennas,

    };
  },
};
</script>

<style scoped>
/* Estilos específicos para el componente de la tabla */
</style>