<template>
  <v-dialog v-model="isDialogVisible" max-width="800px">
    <v-card>
      <v-card-title class="headline justify-center">
        <span>Configuración</span>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6" v-for="config in configuraciones" :key="config._id">
            <v-card class="pa-3 hover-effect">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-text-field v-model="config.itemName" :placeholder="config.itemKey" :label="config.itemKey" dense />
                </v-list-item-content>
                <!-- <v-list-item-action>
                  <v-switch v-model="config.status" color="primary" inset />
                </v-list-item-action> -->
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        <v-alert v-if="!configuraciones.length" type="info" class="mt-4">
          No se encontró ninguna configuración.
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <div class="flex justify-end mt-8 space-x-4">
          <button type="button" @click="closeDialog"
            class="px-6 py-2 bg-[#bfd3e6] text-gray-700 rounded-lg font-medium hover:bg-[#95b7d5] transition">
            Cancelar
          </button>
          <button type="button" @click="saveConfig"
            class="px-6 py-2 bg-[#396895] text-white rounded-lg font-medium hover:bg-[#396895] transition">
            Guardar
          </button>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { listarCuentasApi, updateCuentasApi } from '@/api/MenuService';
import store from '@/store';

export default {
  name: 'MenuConfiguracion',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isDialogVisible = ref(props.isVisible);
    const configuraciones = ref([]);

    const fetchConfiguraciones = async () => {
      try {
        const token = store.state.token;
        if (store.state.role === 'CUSTOMER_MASTER') {
          const response = await listarCuentasApi(token);
          configuraciones.value = response.data.data;

        }

      } catch (error) {
        console.error('Error fetching configuraciones:', error);
      }
    };

    const closeDialog = () => {
      isDialogVisible.value = false;
      emit('close');
    };
    const saveConfig = async () => {
      try {
        const token = store.state.token;
        const payload = configuraciones.value.map(config => ({
          itemKey: config.itemKey,
          itemName: config.itemName,
          status: config.status,
        }));

        await updateCuentasApi(token, payload); // Guardar en la API

        // Actualizar Vuex y localStorage
        store.commit('setMenuData', payload);


        Swal.fire({
          icon: 'success',
          title: 'Configuración guardada',
          text: 'Los cambios se han aplicado correctamente.',
        });

        setTimeout(() => {
          location.reload();
        }, 1500);

        closeDialog();

        // Notificar al componente padre
        emit('config-updated');

      } catch (error) {
        console.error('Error guardando configuraciones:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar la configuración.',
        });
      }
    };


    onMounted(() => {
      fetchConfiguraciones();
    });

    watch(() => props.isVisible, (newVal) => {
      isDialogVisible.value = newVal;
      if (newVal) {
        fetchConfiguraciones();
      }
    });

    return {
      isDialogVisible,
      configuraciones,
      closeDialog,
      saveConfig,
    };
  },
};
</script>

<style scoped>
.v-card-title {
  display: flex;
  justify-content: center;
}

.headline {
  font-weight: bold;
  font-size: 1.5rem;
}

.pa-3 {
  padding: 16px;
}

.hover-effect {
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.hover-effect:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}
</style>
