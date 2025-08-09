<template>
  <div class="containerlogin flex h-screen">
    <!-- Sección izquierda: Formulario -->
    <div class="form-wrapper relative w-full lg:w-3/10 h-full p-4 bg-white text-black shadow-lg">
      <div class="formLogin h-full flex flex-col justify-center">
        <FormAuthVue @validate-login="onValidateLogin" />
      </div>
    </div>

    <!-- Sección derecha: Imagen de fondo -->
    <div class="image-background w-7/10 hidden lg:block"></div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-[9999]">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        <p class="text-white text-lg font-semibold">Cargando, por favor espera...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FormAuthVue from '@/components/login/FormAuth.vue';
import { authLoginApi } from '@/api/LoginService';
import { listarCuentasApi } from '@/api/MenuService';
import store from '@/store';
import Swal from 'sweetalert2';

export default {
  components: {
    FormAuthVue,
  },
  setup() {
    const isLoading = ref(false);
    const messageError = ref('');
    const statusError = ref(false);
    const router = useRouter();
    const route = useRoute();
    const openLoading = () => {
      isLoading.value = true;
    }
    const closeLoading = () => {
      isLoading.value = false;
    }
    // Función separada para manejar la lógica del menú
    const handleMenuConfiguration = async (token) => {
      try {
        const menuResponse = await listarCuentasApi(token);

        if (menuResponse.status && Array.isArray(menuResponse.data.data)) {
          // Guarda los datos del menú en el store
          store.commit('setMenuData', menuResponse.data.data);
        } else {
          console.error('La respuesta del menú no es válida:', menuResponse);
        }
      } catch (error) {
        console.error('Error al obtener el menú:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar el menú',
          text: 'No se pudo obtener la configuración del menú de navegación.',
        });
      }
    };

    const onValidateLogin = async (data) => {
      try {
        openLoading();
        const response = await authLoginApi(data);
        const user = response.data.data;
        const token = user.token;
 
        // Guarda los datos del usuario en el store
        store.commit('setUsername', user.username);
        store.commit('setToken', token);
        store.commit('setRole', user.role);
        store.commit('setLogo', user.logoName)
        store.commit('setIsAuthenticated', true);
        store.commit('setCustomerid', user.customerId)

        // Llama a la función para manejar la configuración del menú
        if (store.state.role === 'CUSTOMER_MASTER') {
          await handleMenuConfiguration(token);
        }

        closeLoading();
        // Redirige a la página principal
        router.push('/');
      } catch (error) {
        console.error('Error en el proceso de inicio de sesión:', error);
        closeLoading();
        // Configuración de alertas según el tipo de error
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: 'error',
              title: 'Credenciales inválidas',
              text: 'Las credenciales de usuario no son válidas',
            });
          } else if (error.response.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error del servidor',
              text: 'Error 500: Error interno del servidor',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message,
            });
          }
        } else if (error.request) {
          Swal.fire({
            icon: 'error',
            title: 'Sin respuesta',
            text: 'No se recibió respuesta del servidor',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de solicitud',
            text: 'Error al configurar la solicitud: ' + error.message,
          });
        }
      }
    };

    onMounted(() => {
      const username = route.query.username;
      const password = route.query.password;

      if (username && password) {
        onValidateLogin({ username, password });
      }
    });

    return {
      onValidateLogin,
      messageError,
      statusError,
      openLoading,
      closeLoading,
      isLoading,
    };
  },
};
</script>

<style scoped>
.containerlogin {
  width: 100%;
  height: 100%;
  display: flex;
}

.form-wrapper {
  background-color: #ffffff;
  flex: 2.5; /* 30% del ancho */
}

.image-background {
  background-image: url('@/assets/login/freepik__upload__14046.jpeg');
  background-size: cover;
  background-position: center;
  height: 100%;
  flex: 7; /* 70% del ancho */
}

</style>
