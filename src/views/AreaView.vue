<template>
    <div>
        <div class="flex justify-between items-center">
            <h1 class="font-bold lg:text-2xl text-xl text-gray-500 mb-5"> {{nameArea}}</h1>
            <button
                class="flex items-center justify-center bg-[#396895] text-white font-bold px-4 py-1 rounded-lg hover:bg-[#6999c2] shadow-md mdi mdi-plus text-xl"
                @click="openCreateForm">
            </button>
        </div>

        <DataTable :items="items" @viewAntennas="listAntennas" @deleteItem="deleteItems" @editItem="openEditForm" />
        <AntennasModal v-if="isAntennasModalVisible" :antennas="selectedAntennas" @close="closeAntennaModal"
            :isVisible="isAntennasModalVisible" />


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

import { listAreasApi, deleteAreaApi, createAreaApi, updateAreaApi } from '@/api/AreaService'

import AntennasModal from '@/components/area/ViewAntenas.vue';
import createForm from '@/components/area/CreateForm.vue';
import EditForm from '@/components/area/EditForm.vue';
import store from '@/store';
import DataTable from '@/components/area/DataTable.vue';
import Swal from 'sweetalert2';

export default {
    components: { DataTable, AntennasModal, createForm, EditForm },
    setup() {
        const items = ref([]);
        const selectedAntennas = ref(null)
        const selectedItem = ref(null)
        const isLoading = ref(false);
        const isAntennasModalVisible = ref(false);
        const isCreateFormVisible = ref(false);
        const isEditFormVisible = ref(false);

        const nameArea = store.getters.getItemName('Áreas');
        
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
            console.log(data)
            openLoading();
            try {
                const token = store.state.token;
                const id = data._id;

                
                const response = await updateAreaApi(token, data, id);

                if (response) {
                    closeEditForm();
                    closeLoading();

                    // Alerta de éxito
                    Swal.fire({
                        title: 'Éxito',
                        text: 'El área fue actualizada correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                }

                await fetchItems();
            } catch (error) {
                closeLoading();

                // Obtener el mensaje de error desde la respuesta
                const errorMessage = error.response?.data?.message || error.response?.data || 'Ocurrió un error inesperado';

                console.error('Error al actualizar el área:', errorMessage);

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
                

                await createAreaApi(token, data);
                await fetchItems();
                closeCreateForm();

                // Alerta de éxito
                Swal.fire({
                    title: 'Éxito',
                    text: 'El área fue creada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                closeCreateForm();

                // Obtener el mensaje de error desde la respuesta
                const errorMessage = error.response?.data?.message || error.response?.data || 'Ocurrió un error inesperado';

                console.error('Error al crear el área:', errorMessage);

                // Alerta de error
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
                    return; // Salir si el usuario cancela
                }

                openLoading();

                const token = store.state.token;
                const id = item._id;

                const response = await deleteAreaApi(token, id);

                if (response) {
                    closeLoading();

                    // Alerta de éxito
                    Swal.fire({
                        title: 'Eliminado',
                        text: 'El área fue eliminada correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                }

                await fetchItems();
            } catch (error) {
                closeLoading();

                // Obtener el mensaje de error desde la respuesta
                const errorMessage = error.response?.data?.message || error.response?.data || 'Ocurrió un error inesperado';

                console.error('Error al eliminar el área:', errorMessage);

                // Alerta de error
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };


        const fetchItems = async () => {
            openLoading();
            try {
                const token = store.state.token;
                const response = await listAreasApi(token);
                items.value = response.data.data;

                if (response) {
                    closeLoading();
                }
            } catch (error) {
                closeLoading();

                // Obtener el mensaje de error desde la respuesta
                const errorMessage = error.response?.data?.message || error.response?.data || 'Ocurrió un error al listar las áreas.';

                console.error('Error al obtener las rutas:', errorMessage);

                // Alerta de error
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };




        onMounted(fetchItems);

        return {
            items,
            fetchItems,
            openLoading,
            closeLoading,
            isLoading,
            listAntennas,

            closeAntennaModal,
            nameArea,
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
            selectedAntennas
        };
    },
};
</script>
