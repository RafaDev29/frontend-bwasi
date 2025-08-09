<template>
  <div
    v-if="position"
    class="absolute flex flex-col items-center cursor-pointer"
    :style="{
      top: `${position.y}px`,
      left: `${position.x}px`,
      transform: 'translate(-50%, -50%)',
    }"
  >
    <div class="relative">
      <!-- Ícono del Beacon -->
      <div
        class="w-6 h-6 rounded-full shadow-md flex items-center justify-center"
        :class="{ 'highlighted': isHighlighted }"
        :style="{
          backgroundColor: isHighlighted ? 'yellow' : (beacon.backgroundColor || 'white'),
          border: `1px solid ${beacon.color || '#000000'}`,
        }"
        @mouseover="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        <i
          :class="beacon.icon"
          :style="{
            color: beacon.color,
            fontSize: beacon.size || '14px',
          }"
        ></i>
      </div>

      <!-- Tooltip with count -->
      <div
        v-if="showTooltip"
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-50"
      >
        {{ beacon.typeName }} ({{ beacon.groupCount || 1 }})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    beacon: {
      type: Object,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    isHighlighted(newValue) {
      if (newValue) {
        console.log(`Beacon with ID ${this.beacon._id} received highlight event.`);
      }
    },
  },
  data() {
    return {
      showTooltip: false
    };
  }
};
</script>

<style scoped>
.mdi {
  transition: color 0.3s ease; /* Transición suave para el color del icono */
}

/* Efecto de resaltado mejorado */
.highlighted {
  animation: pulse 1.5s infinite ease-in-out;
  transform: scale(1.2); /* Aumenta ligeramente el tamaño durante el resaltado */
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.6); /* Añade un brillo alrededor */
}

@keyframes pulse {
  0% {
    transform: scale(1.2);
    background-color: #fc9b9b; /* Color inicial más claro */
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.8); /* Color basado en el rango de colores */
  }
  50% {
    transform: scale(1.3);
    background-color: #f86d6d; /* Color más vibrante */
    box-shadow: 0 0 20px rgba(222, 41, 41, 1); /* Color más oscuro para mayor intensidad */
  }
  100% {
    transform: scale(1.2);
    background-color: #fc9b9b; /* Regreso al color inicial */
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.8); /* Suaviza el efecto */
  }
}

/* Suaviza la transición al detener el resaltado */
.highlighted:not(.highlighted) {
  transition: all 0.3s ease;
}

/* Efectos al hover */
.w-6.h-6:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Color de fondo al pasar el mouse */
  box-shadow: 0 0 5px rgb(4, 66, 113); /* Suave sombra al hover */
}
</style>