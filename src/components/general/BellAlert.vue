<template>
  <div class="notification-container relative inline-block z-9000">
    <!-- Campanita -->
    <div class="bell cursor-pointer text-3xl" @click="toggleNotifications">
      <button class="relative">
        <i class="mdi mdi-bell pr-2 transition-transform duration-300 hover:scale-110" style="color: #28415c;"></i>
        <span v-if="notifications.length"
          class="badge absolute top-0 mr-4 mt-1 pr-2 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs transform translate-x-1/2 -translate-y-1/2 shadow-sm">
          {{ notifications.length }}
        </span>
      </button>
    </div>

    <!-- Lista de Notificaciones -->
    <transition name="slide-fade">
      <div v-if="showNotifications"
        class="notification-list absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-50 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <ul class="divide-y divide-gray-100">
          <li v-for="(notification, index) in sortedNotifications" :key="index"
            :class="getNotificationClass(notification)"
            class="p-4 flex items-start justify-between hover:bg-gray-50 transition-colors duration-200">
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <p class="text-sm font-medium text-gray-800">
                  <span class="text-blue-500">({{ notification.identifier }})</span> 
                  {{ notification.name }} - {{ notification.namerule }}
                </p>
                <!-- Botón para mostrar/ocultar detalles con íconos -->
                <button class="text-blue-500 hover:text-blue-600 focus:outline-none ml-2"
                  @click="toggleDetails(index)">
                  <i :class="expandedItems[index] ? 'mdi mdi-minus' : 'mdi mdi-plus'"></i>
                </button>
              </div>
              <!-- Detalles (área, descripción y timestamp) -->
              <transition name="fade">
                <div v-if="expandedItems[index]" class="mt-2">
                  <p v-if="notification.name !== 'Gateway'" class="text-xs text-gray-600">
                    {{ notification.area }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ notification.description }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ formatTimestamp(notification.timestamp) }}
                  </p>
                </div>
              </transition>
            </div>
            <button class="text-red-500 hover:text-red-600 transition-colors duration-200"
              @click="removeNotification(index)">
              <i class="mdi mdi-close"></i>
            </button>
          </li>
        </ul>
        <div v-if="!notifications.length" class="text-center py-6 text-gray-500">
          <i class="mdi mdi-bell-off-outline text-2xl"></i>
          <p class="mt-2">No hay notificaciones</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const showNotifications = ref(false);
    const store = useStore();
    const expandedItems = ref({});

    // Obtener las notificaciones desde el store
    const notifications = computed(() => store.getters.getNotifications);

    // Ordenar las notificaciones más recientes primero
    const sortedNotifications = computed(() =>
      [...notifications.value].reverse()
    );

    // Inicializar el estado de expansión para cada notificación
    watch(notifications, (newNotifications) => {
      newNotifications.forEach((_, index) => {
        if (expandedItems.value[index] === undefined) {
          expandedItems.value[index] = false;
        }
      });
    }, { immediate: true });

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const removeNotification = (index) => {
      const originalIndex = notifications.value.length - 1 - index;
      store.commit("removeNotification", originalIndex);
    };

    const toggleDetails = (index) => {
      expandedItems.value[index] = !expandedItems.value[index];
    };

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
    };

    const handleClickOutside = (event) => {
      const notificationContainer = document.querySelector('.notification-container');
      if (notificationContainer && !notificationContainer.contains(event.target)) {
        showNotifications.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    // Definir el fondo de la notificación según la descripción
    const getNotificationClass = (notification) => {
      if (notification.description === "Se ha registrado un gateway inactivo.") {
        return "bg-red-200"; // Fondo rojo
      } else if (notification.description === "El gateway ha vuelto a tener conectividad.") {
        return "bg-green-200"; // Fondo verde
      }
      return ""; // Sin fondo
    };

    return {
      showNotifications,
      notifications,
      sortedNotifications,
      expandedItems,
      toggleNotifications,
      removeNotification,
      toggleDetails,
      formatTimestamp,
      getNotificationClass,
    };
  },
};
</script>
