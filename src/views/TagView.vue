<template>
    <div>
        <div class="flex justify-between items-center">
            <h1 class="font-bold lg:text-2xl text-xl text-gray-500 mb-5"> {{nameTag}}</h1>
            <button
                class="flex items-center justify-center bg-[#497fae] text-white font-bold px-4 py-1 rounded-lg hover:bg-[#6999c2] shadow-md mdi mdi-plus text-xl"
                @click="openCreateForm">
            </button>
        </div>

        <DataTable :items="items" @viewAntennas="listAntennas" @deleteItem="deleteItems" @editItem="openEditForm"
            @deleteMassive="deleteMassive" @updateMassive="handleUpdateMassive" @importExcel="openImportModal" />
        <createForm v-if="isCreateFormVisible" @close="closeCreateForm" @ItemCreate="submitItems" />
        <EditForm v-if="isEditFormVisible" :item="selectedItem" @close="closeEditForm" @updateItem="updateItems" />
        <EditCategory v-if="showUpdateModal" :ids="selectedIds" @close="showUpdateModal = false"
            @confirmUpdate="UpdateMassive" />

        <ImportModal v-if="isImportModalVisible" :tagId="tagId" @close="closeImportModal"
            @confirmImport="submitItemsMasive" />
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
import { ref, onMounted, watch } from 'vue';

import { useRoute } from "vue-router";
import { createTagApi, deleteTagApi, updateTagApi, deleteMassiveTagApi, updateMassiveTagApi, listTagApiId } from '@/api/TagService'
import createForm from '@/components/tag/CreateForm.vue';
import EditForm from '@/components/tag/EditForm.vue';
import store from '@/store';
import DataTable from '@/components/tag/DataTable.vue';
import EditCategory from '@/components/tag/EditCategory.vue'
import ImportModal from '@/components/tag/ImportModal.vue'
import Swal from 'sweetalert2';


export default {
    props: {
        id: {
            type: String,
            default: null,
        },
    },
    components: { DataTable, createForm, EditForm, EditCategory, ImportModal },
    setup(props) {
        const nameTag = store.getters.getItemName('Items Moviles')
        const route = useRoute();
        const tagId = ref(props.id || route.params.id);
        const items = ref([]);
        const selectedAntennas = ref(null)
        const selectedItem = ref(null)
        const isLoading = ref(false);
        const isAntennasModalVisible = ref(false);
        const isCreateFormVisible = ref(false);
        const isEditFormVisible = ref(false);
        const showUpdateModal = ref(false);
        const selectedIds = ref([]);
        const isImportModalVisible = ref(false);

        const openImportModal = () => {
            isImportModalVisible.value = true;
        };

        const closeImportModal = () => {
            isImportModalVisible.value = false;
        };
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

        const handleUpdateMassive = (ids) => {
            selectedIds.value = ids;
            showUpdateModal.value = true;
        };

        const UpdateMassive = async (data) => {
            openLoading();
            try {
                const token = store.state.token;
                await updateMassiveTagApi(token, data);
                closeLoading();
                await fetchItems();
                Swal.fire({ title: 'Éxito', text: 'Se actualizó correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al realizar la actualización masiva.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };

        const updateItems = async (data) => {
            openLoading();
            try {
                const token = store.state.token;
                const id = data._id;
                await updateTagApi(token, data, id);
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
            const array = [{
                name: data.name,
                typeId: tagId.value,
                mac: data.mac,
                proxyName: data.proxyName,
                proxyEmail: data.proxyEmail,
                proxyPhone: data.proxyPhone,
                proxyName2: data.proxyName2,
                proxyEmail2: data.proxyEmail2,
                proxyPhone2: data.proxyPhone2,
                identifier: data.identifier,
            }];


            try {
                const token = store.state.token;
                await createTagApi(token, array);
                await fetchItems();
                closeCreateForm();
                Swal.fire({ title: 'Éxito', text: 'Se creó correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeCreateForm();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al crear la etiqueta.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };

        const submitItemsMasive = async (data) => {
            openLoading();
            try {
                const token = store.state.token;
                await createTagApi(token, data);

                await fetchItems();
                closeImportModal();
                closeLoading();
                Swal.fire({ title: 'Éxito', text: 'Se creó correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeImportModal();
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al crear la etiqueta.';
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
                const array = { ids: [item._id] };
                await deleteTagApi(token, array);
                closeLoading();
                await fetchItems();
                Swal.fire({ title: 'Éxito', text: 'Se eliminó correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al eliminar la etiqueta.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };
        const deleteMassive = async (items) => {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción eliminara multiples etiquetas",
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
                const payload = { ids: items };
                const token = store.state.token;
                await deleteMassiveTagApi(token, payload);
                closeLoading();
                await fetchItems();
                Swal.fire({ title: 'Éxito', text: 'Se eliminaron las etiquetas correctamente.', icon: 'success', confirmButtonText: 'Aceptar' });
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al eliminar las etiquetas.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };


        const fetchItems = async () => {
            openLoading();
            try {
                const token = store.state.token;
                const response = await listTagApiId(token, tagId.value);
                items.value = response.data.data;
                closeLoading();
            } catch (error) {
                closeLoading();
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error al obtener las etiquetas.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', confirmButtonText: 'Aceptar' });
            }
        };

        watch(
            () => route.params.id,
            (newId) => {
                if (newId) {
                    tagId.value = newId;
                    fetchItems();
                } else {
                    console.warn('El ID de etiqueta es nulo.');
                }
            }
        );

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
            deleteMassive,
            showUpdateModal,
            selectedIds,
            handleUpdateMassive,
            UpdateMassive,
            tagId,
            isImportModalVisible,
            openImportModal,
            closeImportModal,
            submitItemsMasive,
            nameTag
        };
    },
};
</script>
