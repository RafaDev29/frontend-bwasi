<template>
    <div class="layout pb-1 mb-1">
        <!-- Cabecera del Layout -->
        <div class="layout-header bg-primary-darken-1 text-white p-3 flex justify-between items-center">
            <h2 class="text-xl font-bold">{{ layout.name }}</h2>
            <div class="text-sm">
                <span class="font-medium">{{nameArea}}:</span> {{ layout.areas.length }} |
                <span class="font-medium">{{nameTags}}:</span> {{ totalBeacons }}
            </div>
        </div>

        <!-- Áreas -->
        <div class="layout-areas">
            <div
                v-for="(area, index) in layout.areas"
                :key="area._id"
                :class="['area-box', { 'area-box-full': isFullWidth(index, area) }]"
                :style="getDynamicStyle(area)"
            >
                <!-- Componente MonitoringArea -->
                <MonitoringArea
                    :area="area"
                    :areaIndex="index"
                    :highlightedBeacon="highlightedBeacon"
                    @beaconSelected="$emit('beaconSelected', $event)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import MonitoringArea from "@/components/monitoringv1/MonitoringArea.vue";
import store from "@/store";
export default {
    name: "MonitoringLayout",
    components: {
        MonitoringArea,
    },
    props: {
        layout: {
            type: Object,
            required: true,
        },
        highlightedBeacon: {
            type: String,
            default: null,
        },
    },
    setup(props) {

        const nameTags = store.getters.getItemName('Items Moviles')
        const nameArea = store.getters.getItemName('Áreas')
        // Computed property to calculate the total number of beacons
        const totalBeacons = computed(() =>
            props.layout.areas.reduce((total, area) => total + area.items.length, 0)
        );

        // Method to determine full-width areas
        const isFullWidth = (index, area) => {
            const isSingleInRow =
                props.layout.areas.length % 2 !== 0 &&
                index === props.layout.areas.length - 1;
            return isSingleInRow || area.items.length > 1;
        };

        // Method to dynamically style areas based on the number of beacons
        const getDynamicStyle = (area) => {
            const baseHeight = 150; // Minimum height
            const heightFactor = 30; // Height increase per beacon
            const maxHeight = 300; // Maximum height
            const areaHeight = Math.min(
                baseHeight + area.items.length * heightFactor,
                maxHeight
            );

            return {
                height: `${areaHeight}px`, // Adjust height
                minHeight: "150px", // Minimum height
            };
        };

        return {
            totalBeacons,
            isFullWidth,
            getDynamicStyle,
            nameTags,
            nameArea
        };
    },
};
</script>

<style scoped>
/* Contenedor principal del Layout */
.layout {
    display: flex;
    flex-direction: column;
    background: rgba(3, 119, 221, 0.026);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 2px;
    box-shadow: 0 4px 10px rgba(2, 157, 246, 0.241);
}

/* Contenedor de Áreas */
.layout-areas {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Máximo 2 áreas por fila */
    gap: 5px;
    padding: 1rem;
    align-items: stretch;
}

/* Estilo básico para cada área */
.area-box {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-radius: 2px;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: "Arial", sans-serif;
    transition: all 0.3s ease-in-out;
}

/* Hover para todas las áreas */
.area-box:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}

/* Área que ocupa todo el ancho */
.area-box-full {
    grid-column: span 2; /* Ocupar todo el ancho del layout */
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}
</style>
