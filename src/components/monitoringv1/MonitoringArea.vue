<template>
    <!-- Cabecera del Área -->
    <div class="p-1">
        <div class="p-1 flex justify-between items-center">
            <h3 class="text-md font-bold text-primary text-left">{{ area.name }}</h3>
            <span class="text-sm text-gray-500">Etiquetas: {{ area.items.length }}</span>
        </div>

    
        <!-- Lista de Beacons -->
        <div v-if="area.items.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1 p-1">
            <MonitoringBeacon v-for="beacon in area.items" :key="beacon._id" :beacon="beacon"
                :highlighted="highlightedBeacon === beacon._id" @click="selectBeacon(beacon)" />
        </div>


    </div>

</template>

<script>
import MonitoringBeacon from '@/components/monitoringv1/MonitoringBeacon.vue';

export default {
    name: 'MonitoringArea',
    props: {
        area: {
            type: Object,
            required: true,
        },
        areaIndex: {
            type: Number,
            required: true, // Para recibir el índice del área desde el componente padre
        },
        highlightedBeacon: {
            type: String,
            default: null, // ID del beacon a resaltar
        },
    },
    components: {
        MonitoringBeacon,
    },
    setup(props, { emit }) {
        const selectBeacon = (beacon) => {
            emit('beaconSelected', beacon);
        };

        return {
            selectBeacon,
        };
    },
};
</script>

<style scoped>
/* Opcional: estilos para ajustar la separación y alineación */
</style>
