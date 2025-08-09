<template>
  <div class="flex items-center space-x-4 mb-5">
    <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
      density="compact"></v-text-field>
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <button v-bind="props"
          class="flex items-center justify-center bg-[#497fae] text-white font-bold px-4 py-1 rounded-lg hover:bg-[#6999c2] shadow-md text-xl mdi mdi-format-list-bulleted">
        </button>
      </template>

      <v-list>
        <v-list-item v-for="event in events" :key="event.value" @click="handleEventSelection(event)"
          class="hover:bg-gray-100 cursor-pointer">
          <v-list-item-title class="flex items-center" :class="{
            'text-[#099cb4]': event.value === 'ACTIVATE',
            'text-[#497fae]': event.value === 'DEACTIVATE',
            'text-red-600': event.value === 'DELETE',
          }">
            <v-icon :class="{
              'text-[#099cb4]': event.value === 'ACTIVATE',
              'text-[#497fae]': event.value === 'DEACTIVATE',
              'text-red-600': event.value === 'DELETE',
            }" class="mr-2">
              {{ event.icon }}
            </v-icon>
            {{ event.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>

  <v-card flat>
    <v-data-table :headers="headers" :items="filteredItems" :search="search" show-select item-value="_id"
      v-model="selectedItems" density="compact" class="ma-2">


      <!-- Modificar cómo se renderiza la columna Paradas -->
      <template v-slot:[`item.areas`]="{ item }">
        <!-- Ícono para ver Paradas -->
        <v-icon small color="#497fae" @click="viewAntennas(item)">
          mdi-eye
        </v-icon>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-icon small :color="item.status ? '#497fae' : 'grey'">
          {{ item.status ? 'mdi-bell-ring' : 'mdi-bell-off' }}
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
    </v-data-table>
  </v-card>
</template>

<script>
import { ref, computed } from "vue";
import Swal from 'sweetalert2';
export default {
  name: "DataTable",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ["deleteItem", "editItem", "viewAntennas", "selectedItemsEvent"],
  setup(props, { emit }) {

    const search = ref("");
    const selectedItems = ref([]); // Para las filas seleccionadas
    const selectedEvent = ref(null);
    const events = ref([
      { title: "Activar", value: "ACTIVATE", icon: "mdi-bell-ring" },
      { title: "Desactivar", value: "DEACTIVATE", icon: "mdi-bell-off" },
      { title: "Eliminar", value: "DELETE", icon: "mdi-delete" },
    ]);

    const headers = ref([
      { key: "id", title: "ID" },
      { key: "name", title: "Nombre" },
      { key: "status", title: "Estado" },
      { key: "areas", title: "Detalle" },
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
        ...item
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

    const handleEventSelection = (event) => {

      if (selectedItems.value.length === 0) {
        Swal.fire({ title: 'Atención', text: 'Por favor, selecciona al menos una notificación para realizar esta acción.', icon: 'warning', confirmButtonColor: '#f7a304', confirmButtonText: 'Aceptar' });
        return;
      }

      const selectedIds = selectedItems.value;
      emit("selectedItemsEvent", { action: event.value, ids: selectedIds });
    };

    const clearSelection = () => {
      selectedItems.value = [];
    };



    return {
      search,
      headers,
      filteredItems,
      selectedItems,
      deleteItem,
      editItem,
      viewAntennas,
      handleEventSelection,
      selectedEvent,
      events,
      clearSelection

    };
  },
};
</script>

<style scoped>
/* Estilos específicos para el componente de la tabla */
</style>
