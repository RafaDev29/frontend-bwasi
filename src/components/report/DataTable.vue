<template>
  <div class="mb-5 pb-5">

    <v-text-field
      v-model="search"
      label="Buscar"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
      class="mb-5 PT-3"
      density="compact"
    ></v-text-field>

    <!-- Tabla de datos -->
    <v-card flat>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        density="compact"
        class="ma-2"
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { eventBus } from "@/utils/eventBus";
import * as XLSX from "xlsx";

export default {
  name: "DataTable",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const search = ref("");

    // Define las funciones para formatear horas y fechas
    const formatTime = (isoString) => {
      if (!isoString) return "";
      const date = new Date(isoString);
      date.setHours(date.getHours() + 5 ); // Ajustar a UTC-5
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23", // Formato 24 horas
      });
    };

    const formatDate = (isoString) => {
      if (!isoString) return "";
      const date = new Date(isoString);
      date.setHours(date.getHours() + 6 ); // Ajustar a UTC-5
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

  
    const headers = ref([
      { key: "id", title: "#" },
      { key: "createdAt", title: "Fecha" },
      { key: "identifier", title: "Identificador" },
      // { key: "itemMobileMac", title: "MAC" },
      { key: "name", title: "Nombre" },
      { key: "entryTime", title: "Hora de ingreso" },
      { key: "exitTime", title: "Hora de salida" },
      { key: "area.name", title: "Área" },
   
      { key: "difference", title: "Tiempo de permanencia" },
    ]);

    // Prepara los datos de la tabla con formato
    const indexedItems = computed(() => {
      return props.items.map((item, index) => ({
        id: index + 1,
        itemMobileMac: item.itemMobileMac,
        name: item.name,
        entryTime: formatTime(item.entryTime),
        exitTime: formatTime(item.exitTime),
        "area.name": item.area?.name || "N/A", // Mapea el nombre del área
        identifier: item.identifier,
        difference: item.difference,
        createdAt: formatDate(item.createdAt), // Formatear la fecha completa
      }));
    });

    // Filtrar datos según la búsqueda
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

    // Exportar los datos de la tabla filtrados a Excel
    const exportToExcel = () => {
      const dataToExport = filteredItems.value.map((item) => {
        const row = {};
        headers.value.forEach((header) => {
          row[header.title] = item[header.key];
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
      XLSX.writeFile(workbook, "reporte.xlsx");
    };

    const handleExportEvent = () => {
      console.log("Generando archivo Excel con los datos de la tabla...");
      exportToExcel();
    };

    onMounted(() => {
      eventBus.on("export-requested", handleExportEvent);
    });

    onUnmounted(() => {
      eventBus.off("export-requested", handleExportEvent);
    });

    return {
      search,
      filteredItems,
      headers,
    };
  },
};
</script>

<style scoped>
/* Estilos específicos para el componente de la tabla */
</style>
