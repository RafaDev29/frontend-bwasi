import { createStore } from "vuex";

const localStorageKey =
  "DJsdfg-2352LLDSF-dfglñdskfgiu38r_[22334ews34>YUVASZghsvdV";
const menuDataKey = "menuData";
const notificationsKey = "notifications";
export default createStore({
  state: {
    isAuthenticated: false,
    role: "",
    username: "",
    token: "",
    customerid: "",
    logoName: "",
    menuData: {}, 
    notifications: [],
  },
  getters: {
    // Obtiene el nombre dinámico basado en `itemKey`
    getItemName: (state) => (itemKey) => {
      return state.menuData[itemKey]?.itemName || "";
    },
    // Verifica si un item está habilitado (`status`)
    getItemStatus: (state) => (itemKey) => {
      return state.menuData[itemKey]?.status || false;
    },
    getNotifications: (state) => {
      return state.notifications;
    },
  },
  mutations: {
    removeNotification(state, index) {
      state.notifications.splice(index, 1);
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },

    addNotification(state, notification) {
      state.notifications.push(notification);

      // Actualizar el `localStorage`
      localStorage.setItem(
        notificationsKey,
        JSON.stringify(state.notifications)
      );
    },
    setIsAuthenticated(state, value) {
      state.isAuthenticated = value;
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    },
    setUsername(state, value) {
      state.username = value;
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    },
    setToken(state, value) {
      state.token = value;
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    },
    setRole(state, value) {
      state.role = value;
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    },
    setLogo(state, value) {
      state.logoName = value;
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    },
    setCustomerid(state, value) {
      state.customerid = value;
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    },
    // Inicializa el estado global desde localStorage
    initializeStateFromLocalStorage(state) {
      const storedState = localStorage.getItem(localStorageKey);
      if (storedState) {
        Object.assign(state, JSON.parse(storedState));
      }
    },
    // Guarda los datos del menú en el estado y `localStorage`
    setMenuData(state, data) {
      if (!Array.isArray(data)) {
        console.error("setMenuData recibió un valor no válido:", data);
        return;
      }

      state.menuData = data.reduce((acc, item) => {
        acc[item.itemKey] = { itemName: item.itemName, status: item.status };
        return acc;
      }, {});

      localStorage.setItem(menuDataKey, JSON.stringify(state.menuData));
    },
    // Inicializa los datos del menú desde `localStorage`
    initializeMenuDataFromLocalStorage(state) {
      const storedMenu = localStorage.getItem(menuDataKey);
      if (storedMenu) {
        state.menuData = JSON.parse(storedMenu);
      }
    },

    // Inicializar las notificaciones desde el `localStorage`
    initializeNotificationsFromLocalStorage(state) {
      const storedNotifications = localStorage.getItem(notificationsKey);
      if (storedNotifications) {
        state.notifications = JSON.parse(storedNotifications);
      }
    },
    // Limpiar todas las notificaciones
    clearNotifications(state) {
      state.notifications = [];

      // Limpiar también en el `localStorage`
      localStorage.removeItem(notificationsKey);
    },
  },
  actions: {
    // Inicializar las notificaciones desde `localStorage`
    initializeNotificationsFromLocalStorage({ commit }) {
      commit("initializeNotificationsFromLocalStorage");
    },
    // Agregar una nueva notificación al estado y `localStorage`
    addNotification({ commit }, notification) {
      commit("addNotification", notification);
    },
    // Limpiar todas las notificaciones
    clearNotifications({ commit }) {
      commit("clearNotifications");
    },

  
    // Inicializar el estado global desde `localStorage`
    initializeStateFromLocalStorage({ commit }) {
      commit("initializeStateFromLocalStorage");
    },
    // Inicializar los datos del menú desde `localStorage`
    initializeMenuDataFromLocalStorage({ commit }) {
      commit("initializeMenuDataFromLocalStorage");
    },
  },
});
