<template>
    <div>
        <div class="flex justify-between items-center">
            <h1 class="font-bold lg:text-2xl text-xl text-gray-500 mb-5"> Reglas de Notificaciones</h1>
            <button
                class="flex items-center justify-center bg-[#497fae] text-white font-bold px-4 py-1 rounded-lg hover:bg-[#6999c2] shadow-md mdi mdi-plus text-xl"
                @click="openCreateForm">
            </button>
        </div>

        <DataTable ref="dataTable" :items="items" @viewAntennas="listAntennas" @deleteItem="deleteItems"
            @editItem="openEditForm" @selectedItemsEvent="massiveUpdate" />

        <AntennasModal v-if="isAntennasModalVisible" :antennas="selectedAntennas" @close="closeAntennaModal"
            :isVisible="isAntennasModalVisible" />


        <createForm v-if="isCreateFormVisible" @close="closeCreateForm" @ItemCreate="submitItems" />
        <EditForm v-if="isEditFormVisible" :item="selectedItem" @close="closeEditForm" @updateItem="updateItems" />
    </div>


    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75   z-[9999]">
        <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <p class="text-white text-lg font-semibold">Cargando, por favor espera...</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';


import { listaRuleApi, createRuleApi, deleteRuleApi, updateRuleApi, updateMassiveRuleApi } from '@/api/RulesService'

import AntennasModal from '@/components/rules/ViewDetails.vue';
import createForm from '@/components/rules/CreateForm.vue';
import EditForm from '@/components/rules/EditForm.vue';
import store from '@/store';
import DataTable from '@/components/rules/DataTable.vue';
import Swal from 'sweetalert2';

export default {
    components: { DataTable, AntennasModal, createForm, EditForm },
    setup() {
        const dataTableRef = ref(null);
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

                await updateRuleApi(token, data, id);
                closeEditForm();
                closeLoading();
                await fetchItems();
                Swal.fire({ title: 'Éxito', text: 'Se actualizó correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al actualizar.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };


        const submitItems = async (data) => {
            try {
                const token = store.state.token;
                await createRuleApi(token, data);
                await fetchItems();
                closeCreateForm();
                Swal.fire({ title: 'Éxito', text: 'Se creó correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeCreateForm();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al crear la regla.';
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
                await deleteRuleApi(token, id);
                closeLoading();
                await fetchItems();
                Swal.fire({ title: 'Éxito', text: 'Se eliminó correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al eliminar.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };

        const fetchItems = async () => {
            openLoading();
            try {
                const token = store.state.token;
                const response = await listaRuleApi(token);
                items.value = response.data.data;
                if (response) {
                    closeLoading()
                }
            } catch (error) {
                closeLoading();
                console.error('Error al obtener las rutas:', error);
            }
        };

        const massiveUpdate = async (event) => {
            const token = store.state.token;
            const payload = {
                alertRuleIds: event.ids,
                type: event.action,
            };

            try {
                if (event.action === "DELETE") {
                    const result = await Swal.fire({
                        title: "¿Estás seguro?",
                        text: "Esta acción eliminará las reglas seleccionadas. ¡No podrás revertirlo!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#f7a304',
                        cancelButtonColor: '#deddda',
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Sí, eliminar',
                        reverseButtons: true,
                    });

                    if (result.isConfirmed) {
                        const response = await updateMassiveRuleApi(token, payload);
                        if (response) {
                            await fetchItems(); // Recargar los datos actualizados
                            Swal.fire({ title: 'Éxito', text: 'Se eliminó correctamente.', icon: 'success', confirmButtonText: 'Aceptar', confirmButtonColor: '#f7a304' });
                        }
                    }
                } else if (event.action === "ACTIVATE" || event.action === "DEACTIVATE") {
                    const response = await updateMassiveRuleApi(token, payload);
                    if (response) {
                        await fetchItems(); // Recargar los datos actualizados
                        const actionMessage = event.action === "ACTIVATE" ? "activadas" : "desactivadas";
                        Swal.fire({ title: '¡Éxito!', text: `Las reglas se han ${actionMessage} correctamente.`, icon: 'success', confirmButtonColor: '#f7a304' });
                    }
                }

                // Limpiar selección después de la acción
                if (dataTableRef.value && dataTableRef.value.clearSelection) {
                    dataTableRef.value.clearSelection();
                }
            } catch (error) {
                console.error("Error al realizar la acción:", error);
                Swal.fire("Error", "Ocurrió un problema al realizar la acción. Por favor, inténtalo de nuevo.", "error");
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
            selectedAntennas,
            massiveUpdate,
            dataTableRef

        };
    },
};
</script>
