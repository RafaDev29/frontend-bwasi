<template>
  <div class="fixed top-10 pt-10 right-4 space-y-4 z-[9000]">
    <div v-if="notifications.length > 2" class="flex justify-end mb-2">
      <button @click="removeAllNotifications"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-3 py-1 rounded-lg shadow-md transition-all">
        Cerrar todas
      </button>
    </div>

    <div v-for="(notification, index) in notifications" :key="index"
      class="text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform"
      :class="[
        getNotificationClass(notification.area),
        notification.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      ]">
      <div class="flex flex-col">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <i :class="`mdi ${notification.icon} text-xs`"></i>
            <span class="text-xs font-medium">{{ notification.message }} - {{ notification.regla }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="toggleArea(index)" class="text-xs">
              <i :class="`mdi ${notification.showArea ? 'mdi-minus' : 'mdi-plus'}`"></i>
            </button>
            <button @click="removeNotification(index)" class="text-xs text-white hover:text-gray-300">
              <i class="mdi mdi-close"></i>
            </button>
          </div>
        </div>
        <transition name="fade">
          <div v-if="notification.showArea" class="mt-2 text-xs bg-opacity-30 p-2 rounded-md">
            <span>{{ notification.area }}</span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  setup() {
    const notifications = reactive([]);

    /**
     * Muestra una nueva notificación.
     * @param {string} message 
     * @param {string} regla 
     * @param {string} area 
     * @param {string} icon 
     * @param {number} timeout 
     */
    const showNotification = (message, regla, area, icon = "mdi-information", timeout = 10000) => {
      const notification = { message, regla, area, icon, visible: true, showArea: false };

      notifications.push(notification);

      setTimeout(() => {
        notification.visible = false;

        setTimeout(() => {
          const index = notifications.indexOf(notification);
          if (index !== -1) notifications.splice(index, 1);
        }, 10000);
      }, timeout);
    };

    /**
     * Elimina una notificación por índice.
     * @param {number} index
     */
    const removeNotification = (index) => {
      if (index >= 0 && index < notifications.length) {
        notifications.splice(index, 1);
      }
    };

    /**
     * Elimina todas las notificaciones.
     */
    const removeAllNotifications = () => {
      notifications.splice(0, notifications.length);
    };

    const toggleArea = (index) => {
      notifications[index].showArea = !notifications[index].showArea;
    };

    const getNotificationClass = (area) => {
      if (area === " - El gateway ha vuelto a tener conectividad.") {
        return "bg-green-500"; // Fondo verde
      } else if (area === " - Se ha registrado un gateway inactivo.") {
        return "bg-red-500"; // Fondo rojo
      }
      return "bg-gradient-to-r from-[#497fae] to-[#497fae]"; // Fondo original azul
    };

    return {
      notifications,
      showNotification,
      removeNotification,
      removeAllNotifications,
      toggleArea,
      getNotificationClass,
    };
  },
};
</script>

<style scoped>
/* Animación de desvanecimiento para mostrar detalles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
