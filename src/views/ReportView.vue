<template>
    <div>
        <div class="flex justify-between items-center">
            <h1 class="font-bold lg:text-2xl text-xl text-gray-500 mb-5"> Reportes</h1>
        </div>
        <DateForm @apply="fetchItems" @exportExcel="generateExcel"/>
        <DataTable :items="items" />

    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-[9999]">
        <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <p class="text-white text-lg font-semibold">Cargando, por favor espera...</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { listReportApi } from '@/api/ReportService';
import store from '@/store';
import DataTable from '@/components/report/DataTable.vue';
import DateForm from '@/components/report/DateForm.vue';
import Swal from 'sweetalert2';
export default {
    components: { DataTable, DateForm },
    setup() {
        const items = ref([]);
        const isLoading = ref(false);

        const openLoading = () => {
            isLoading.value = true;
        };
        const closeLoading = () => {
            isLoading.value = false;
        };

        const getStartAndEndOfDayUTC5 = () => {
            const now = new Date();
            const utcOffset = -5 * 60; // UTC-5 offset in minutes

            // Ajustar a UTC-5
            const localTime = new Date(now.getTime() + utcOffset * 60 * 1000);

            // Inicio del día
            const startOfDay = new Date(localTime.setUTCHours(0, 0, 0, 0));
            const formattedStartOfDay = startOfDay.toISOString().slice(0, 19).replace("T", " ");

            // Fin del día
            const endOfDay = new Date(localTime.setUTCHours(23, 59, 0, 0));
            const formattedEndOfDay = endOfDay.toISOString().slice(0, 19).replace("T", " ");

            return { dateFrom: formattedStartOfDay, dateTo: formattedEndOfDay };
        };

        const insertDate = async () => {
            try {
                const { dateFrom, dateTo } = getStartAndEndOfDayUTC5();
                const payload = {
                    dateFrom,
                    dateTo,
                    "mobile_items": ["ALL"],
                    "group_mobile_items": ["ALL"],
                    "areas": ["ALL"],
                    "group_areas": ["ALL"]
                };

                await fetchItems(payload);
            } catch (error) {
                console.error("Error al enviar las fechas iniciales:", error);
            }
        };

        const fetchItems = async (payload) => {
            openLoading();
            try {
                const token = store.state.token;
                const response = await listReportApi(token, payload);
                items.value = response.data.data;
                closeLoading();
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al obtener los reportes.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };


        onMounted(insertDate);

        return {
            items,
            fetchItems,
            openLoading,
            closeLoading,
            isLoading,
            insertDate
        };
    },
};
</script>
