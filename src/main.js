import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import VueKonva from 'vue-konva'; 
import router from './router';

// Importamos el store
import store from './store';

loadFonts();

// Llamar a la acción para inicializar el estado desde localStorage
store.dispatch('initializeStateFromLocalStorage');
store.dispatch('initializeMenuDataFromLocalStorage');
store.dispatch("initializeNotificationsFromLocalStorage");

// Configuración correcta del orden
const app = createApp(App);

app
  .use(vuetify)
  .use(router)
  .use(store)
  .use(VueKonva) 
  .mount('#app');
