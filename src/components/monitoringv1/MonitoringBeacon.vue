<template>
    <div class="relative">
        <!-- Ícono del Beacon -->
        <div :class="['w-10 h-10 flex items-center justify-center  bg-#497fae-50  shadow-inner cursor-pointer transition duration-300',
            { 'bg-#497fae-100 hover:bg-#497fae-200': !highlighted, 'animate-flash': highlighted }]" @click="$emit('click')"
            @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
            <i :class="beacon.icon" :style="{
                color: beacon.color,
                fontSize: beacon.size || '30px', /* Aumenta el tamaño a 32px por defecto */
                backgroundColor: beacon.backgroundColor || 'transparent',
                borderRadius: '50%', /* Hace el fondo redondeado */
                padding: '10px', /* Espacio interno para hacerlo visualmente más grande */
                display: 'inline-block' /* Asegura que el ícono respete el tamaño del contenedor */
            }">
            </i>



        </div>

        <!-- Tooltip -->
        <div v-if="showTooltip"
            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-3 py-1 bg-black text-white text-sm font-medium rounded-md">
            {{ beacon.name }}
        </div>
    </div>
</template>

<script>
export default {
    name: "MonitoringBeacon",
    props: {
        beacon: {
            type: Object,
            required: true,
        },
        highlighted: {
            type: Boolean,
            default: false, // Indica si este beacon debe parpadear
        },
    },
    data() {

        return {
            showTooltip: false, // Controla la visibilidad del tooltip
        };
    },
};
</script>

<style scoped>
/* Animación de parpadeo */


@keyframes flash {

    0%,
    100% {
        background-color: rgba(254, 1, 1, 0);
        /* Sin color */
    }

    50% {
        background-color: rgba(255, 132, 0, 0.879);
        /* Amarillo tenue */
    }
}

.animate-flash {
    animation: flash 1s ease-in-out infinite;
}
</style>
