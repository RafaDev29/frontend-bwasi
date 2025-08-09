<template>
    <div>
        <div class="flex justify-between items-center">
            <h1 class="font-bold lg:text-2xl text-xl text-gray-500 mb-5"> Categoria de Antenas</h1>
            <button
                class="flex items-center justify-center bg-[#497fae] text-white font-bold px-4 py-1 rounded-lg hover:bg-[#6999c2] shadow-md mdi mdi-plus text-xl"
                @click="openCreateForm">
            </button>
        </div>

        <formTable :items="items" @ViewAreas="listAreas" @deleteItem="deleteItems" @editItem="openEditForm" />

        <AreasModal v-if="isAreasModalVisible" :areas="selectedAreas" @close="closeAreasModal"
            :isVisible="isAreasModalVisible" />


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
import { listCAntennaApi, deleteCAntennaApi, createCAntennaApi, updateCAntennaApi } from '@/api/CAntennaService';
import formTable from '@/components/cantennas/DataTable.vue';
import createForm from '@/components/cantennas/CreateForm.vue';
import EditForm from '@/components/cantennas/EditForm.vue';
import store from '@/store';
import Swal from 'sweetalert2';

export default {
    components: { formTable, createForm, EditForm },
    setup() {
        const items = ref([]);
        const selectedAreas = ref(null)
        const selectedItem = ref(null)
        const isLoading = ref(false);
        const isAreasModalVisible = ref(false);
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
        const listAreas = (data) => {

            selectedAreas.value = data;
            isAreasModalVisible.value = true;
        };
        const closeAreasModal = () => {
            isAreasModalVisible.value = false;
            selectedAreas.value = null;
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
                    name: data.name
                };

                const response = await updateCAntennaApi(token, payload, id);

                if (response) {
                    closeEditForm();
                    closeLoading();

                    // Alerta de éxito
                    Swal.fire({
                        title: 'Éxito',
                        text: 'La categoría de antena fue actualizada correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });

                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }

                await fetchItems();
            } catch (error) {
                closeLoading();

                // Obtener el mensaje de error desde la respuesta
                const errorMessage = error.response?.data?.message || error.response?.data || 'Ocurrió un error al actualizar la categoría de antena.';

                console.error('Error al actualizar la categoría de antena:', errorMessage);

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
                const payload = { name: data.name };
                await createCAntennaApi(token, payload);
                await fetchItems();
                closeCreateForm();
                Swal.fire({ title: 'Éxito', text: 'La categoría fue creada correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al crear la categoría.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };


        const deleteItems = async (item) => {
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

            if (!result.isConfirmed) return;

            openLoading();
            try {
                const token = store.state.token;
                const id = item._id;
                await deleteCAntennaApi(token, id);
                closeLoading();
                await fetchItems();
                Swal.fire({ title: 'Éxito', text: 'La categoría fue eliminada correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
                setTimeout(() => {
                        location.reload();
                    }, 2000);
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al eliminar la categoría.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };


        const fetchItems = async () => {
            openLoading();
            try {
                const token = store.state.token;
                const response = await listCAntennaApi(token);
                items.value = response.data.data;
                closeLoading();
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al listar las categorías.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };




        onMounted(fetchItems);

        return {
            items,
            fetchItems,
            openLoading,
            closeLoading,
            isLoading,
            listAreas,
            closeAreasModal,
            selectedAreas,
            isAreasModalVisible,
            deleteItems,
            isCreateFormVisible,
            openCreateForm,
            closeCreateForm,
            submitItems,
            updateItems,
            openEditForm,
            closeEditForm,
            isEditFormVisible,
            selectedItem
        };
    },
};
</script>
