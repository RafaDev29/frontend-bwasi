<template>
    <div>
        <div class="flex justify-between items-center">
            <h1 class="font-bold lg:text-2xl text-xl text-gray-500 mb-5"> Grupo de Áreas</h1>
            <button
                class="flex items-center justify-center bg-[#497fae] text-white font-bold px-4 py-1 rounded-lg hover:bg-[#6999c2] shadow-md mdi mdi-plus text-xl"
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
import Swal from 'sweetalert2';


import { listGAreasApi, createGAreasApi, updateGAreasApi, deleteGAreasApi } from '@/api/GAreaService'

import AntennasModal from '@/components/gareas/ViewAreas.vue';
import createForm from '@/components/gareas/CreateForm.vue';
import EditForm from '@/components/gareas/EditForm.vue';
import store from '@/store';
import DataTable from '@/components/gareas/DataTable.vue';



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
                const payload = { name: data.name, areas: data.areas.map(item => item._id) };
                await updateGAreasApi(token, payload, id);
                closeEditForm();
                closeLoading();
                await fetchItems();
                Swal.fire({ title: 'Éxito', text: 'El grupo de áreas fue actualizado correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al actualizar el grupo de áreas.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };

        const submitItems = async (data) => {
            try {
                const token = store.state.token;
                await createGAreasApi(token, data);
                await fetchItems();
                closeCreateForm();
                Swal.fire({ title: 'Éxito', text: 'El grupo de áreas fue creado correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeCreateForm();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al crear el grupo de áreas.';
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
                await deleteGAreasApi(token, id);
                closeLoading();
                await fetchItems();
                Swal.fire({ title: 'Éxito', text: 'El grupo de áreas fue eliminado correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al eliminar el grupo de áreas.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };


        const fetchItems = async () => {
            openLoading();
            try {
                const token = store.state.token;
                const response = await listGAreasApi(token);
                items.value = response.data.data;
                closeLoading();
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al listar los grupos de áreas.';
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
            selectedAntennas
        };
    },
};
</script>
