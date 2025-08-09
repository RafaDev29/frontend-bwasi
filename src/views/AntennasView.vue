<template>
    <div>
        <div class="flex justify-between items-center">
            <h1 class="font-bold lg:text-2xl text-xl text-gray-500 mb-5"> {{nameAntenna}}</h1>
            <button
                class="flex items-center justify-center bg-[#497fae] text-white font-bold px-4 py-1 rounded-lg hover:bg-[#6999c2] shadow-md mdi mdi-plus text-xl"
                @click="openCreateForm">
            </button>
        </div>

        <DataTable :items="items" @viewAntennas="listAntennas" @deleteItem="deleteItems" @editItem="openEditForm" />
        <createForm v-if="isCreateFormVisible" @close="closeCreateForm" @ItemCreate="submitItems" />
        <EditForm v-if="isEditFormVisible" :item="selectedItem" @close="closeEditForm" @updateItem="updateItems" />
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-[9999]">
        <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <p class="text-white text-lg font-semibold">Cargando, por favor espera...</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import store from '@/store';

import { listAntennaApiId, deleteAntennaApi, createAntennaApi, updateAntennaApi } from '@/api/AntennaService'


import createForm from '@/components/antenna/CreateForm.vue';
import EditForm from '@/components/antenna/EditForm.vue';

import DataTable from '@/components/antenna/DataTable.vue';
import Swal from 'sweetalert2';
import { useRoute } from "vue-router";
import { watch } from 'vue'
export default {
    props: {
        id: {
            type: String,
            default: null,
        },
    },
    components: { DataTable, createForm, EditForm },
    setup(props) {
        const nameAntenna = store.getters.getItemName('Puntos de área')
        const route = useRoute();
        const antennaId = ref(props.id || route.params.id);
        const items = ref([]);
        const selectedAntennas = ref(null)
        const selectedItem = ref(null)
        const isLoading = ref(false);
        const isAntennasModalVisible = ref(false);
        const isCreateFormVisible = ref(false);
        const isEditFormVisible = ref(false);
        const openCreateForm = () => {
            isCreateFormVisible.value = true;
        };

        const closeCreateForm = () => {
            isCreateFormVisible.value = false;
        };
        const openLoading = () => {
            isLoading.value = true;
        }
        const closeLoading = () => {
            isLoading.value = false;
        }
        const listAntennas = (data) => {

            selectedAntennas.value = data;
            isAntennasModalVisible.value = true;
        };
        const closeAntennaModal = () => {
            isAntennasModalVisible.value = false;
            selectedAntennas.value = null;
        };

        const openEditForm = (item) => {
            selectedItem.value = { ...item };
            isEditFormVisible.value = true;
        };

        const closeEditForm = () => {
            isEditFormVisible.value = false;
        };

        const updateItems = async (data) => {
            openLoading();
            try {
                const token = store.state.token;
                const id = data._id;

                const payload = {
                    name: data.mac,
                    areaId: data.area._id,
                    typeId: data.typeId._id
                };

                const response = await updateAntennaApi(token, payload, id);

                if (response) {
                    closeEditForm();
                    closeLoading();

                    // Alerta de éxito
                    Swal.fire({
                        title: 'Éxito',
                        text: 'La antena fue actualizada correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                }

                await fetchItems();
            } catch (error) {
                closeLoading();

                // Obtener el mensaje de error desde la respuesta
                const errorMessage = error.response?.data?.message || error.response?.data || 'Ocurrió un error inesperado';

                console.error('Error al actualizar la antena:', errorMessage);

                // Alerta de error
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };



        const submitItems = async (data) => {


            try {
                const token = store.state.token;
                const payload = {
                    mac: data.mac,
                    areaId: data.areaId,
                    typeId: data.typeId
                };

                await createAntennaApi(token, payload);
                await fetchItems();
                closeCreateForm();

                // Mostrar alerta de éxito
                Swal.fire({
                    title: 'Éxito',
                    text: 'El elemento fue creado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                closeCreateForm();

                // Obtener el mensaje de error de la API
                const errorMessage = error.response?.data?.message || error.response?.data || 'Ocurrió un error inesperado';

                console.error('Error al crear el área:', errorMessage);

                // Mostrar alerta de error
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };

        const deleteItems = async (item) => {
            try {
                const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: "No podrás revertir esto.",
                    icon: 'warning',
                    // color : 'white',
                    showCancelButton: true,
                    confirmButtonColor: '#f7a304',
                    cancelButtonColor: '#deddda',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Sí, eliminar',
                    reverseButtons: true,
                });

                if (!result.isConfirmed) {
                    return; // Si el usuario cancela, no hacemos nada
                }

                openLoading();
                const token = store.state.token;
                const id = item._id;
                const response = await deleteAntennaApi(token, id);

                if (response) {
                    closeLoading();
                    Swal.fire(
                        'Eliminado',
                        'El elemento ha sido eliminado con éxito.',
                        'success'
                    );
                }

                await fetchItems();
            } catch (error) {
                closeLoading();
                console.error('Error al eliminar el elemento:', error);
                Swal.fire(
                    'Error',
                    'Ocurrió un error al intentar eliminar el elemento.',
                    'error'
                );
            }
        };

        const fetchItems = async () => {
            if (!antennaId.value) {
                console.warn("No se proporcionó un ID de antena. Cancelando fetchItems.");
                return;
            }

            openLoading();
            try {
                const token = store.state.token;
                const response = await listAntennaApiId(token, antennaId.value); // Usa .value
                items.value = response.data.data;
            } catch (error) {
                console.error("Error al obtener las antenas:", error);
            } finally {
                closeLoading();
            }
        };




        onMounted(fetchItems);

        watch(
            () => route.params.id,
            (newId) => {
                antennaId.value = newId;
                fetchItems();
            }
        );

        return {
            items,
            fetchItems,
            openLoading,
            closeLoading,
            isLoading,
            listAntennas,

            closeAntennaModal,

            deleteItems,
            isCreateFormVisible,
            openCreateForm,
            closeCreateForm,
            submitItems,
            updateItems,
            openEditForm,
            closeEditForm,
            isEditFormVisible,
            selectedItem,
            isAntennasModalVisible,
            selectedAntennas,
            antennaId,
            nameAntenna
        };
    },
};
</script>
