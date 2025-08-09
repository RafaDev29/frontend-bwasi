<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-gray-700 mb-4 text-center">Editar Compañia</h2>
            <form @submit.prevent="submitUpdate">
                <!-- Campo Nombre -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input type="text" v-model="editedItem.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Razón social</label>
                    <input type="text" v-model="editedItem.businessName"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                         required />
                </div>

                <!-- Campo Tipo de Lógica (typeLogic) -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Tipo de configuración</label>
                    <select 
                        v-model="editedItem.typeLogic"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required
                    >
                        <option value="GATEWAYS-STATIC">GATEWAYS-STATIC</option>
                        <option value="GATEWAYS-MOBILE">GATEWAYS-MOBILE</option>
                    </select>
                </div>

                <!-- Campo Nombre de Usuario -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre de Usuario</label>
                    <input type="text" v-model="editedItem.user.username"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>

                <!-- Campo Contraseña con ojito -->
                <div class="mb-4 relative">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Contraseña</label>
                    <div class="flex">
                        <input :type="showPassword ? 'text' : 'password'" v-model="editedItem.user.password"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                            required />

                        <button 
                            type="button" 
                            @click="togglePasswordVisibility"
                            class=" ml-2 flex items-center text-gray-500 hover:text-gray-700"
                        >
                            <v-icon v-if="!showPassword" class="mdi mdi-eye-off"></v-icon>
                            <v-icon v-else class="mdi mdi-eye"></v-icon>
                        </button>
                    </div>
                </div>

                <!-- Campo Imagen (Logo) -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Logo</label>
                    <div class="flex items-center">
                        <!-- Selector de archivo -->
                        <label for="logo" class="cursor-pointer px-4 py-2 bg-[#396895] text-white rounded-lg hover:bg-[#396895]">Seleccionar Imagen</label>
                        <input 
                            type="file" 
                            id="logo"
                            @change="handleImageUpload"
                            class="hidden" 
                            accept="image/*" 
                        />
                    </div>
                    <!-- Mostrar el nombre del archivo si ya existe un logo o si se ha seleccionado uno -->
                    <p v-if="editedItem.logo || editedItem.selectedLogo" class="mt-1 text-sm text-gray-700">
                        {{ editedItem.selectedLogo ? editedItem.selectedLogo.name : editedItem.logo }}
                    </p>
                </div>

                <!-- Botones de Acción -->
                <div class="flex justify-end space-x-2">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-[#396895] text-white rounded-lg hover:bg-[#396895]">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 z-[9999]">
        <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <p class="text-white text-lg font-semibold">Cargando, por favor espera...</p>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { updateCustomersApi } from '@/api/CompanyService';
import store from '@/store';

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    emits: ['close', 'updateItem'],
    setup(props, { emit }) {
        const editedItem = ref({ ...props.item });
        const showPassword = ref(false); // Controla la visibilidad de la contraseña
        const isLoading = ref(false); // Estado para mostrar la pantalla de carga

        // Sincronizar cambios en la prop `item`
        watch(
            () => props.item,
            (newItem) => {
                editedItem.value = { ...newItem };
            }
        );

        // Alternar visibilidad de la contraseña
        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        // Manejar la imagen seleccionada
        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                editedItem.value.selectedLogo = file;
            }
        };

        // Enviar los datos editados
        const submitUpdate = async () => {
            isLoading.value = true;  // Mostrar pantalla de carga
            try {
                const token = store.state.token;
                const formData = new FormData();
                formData.append('name', editedItem.value.name);
                formData.append('businessName', editedItem.value.businessName);
                formData.append('username', editedItem.value.user.username);
                formData.append('password', editedItem.value.user.password);
                formData.append('typeLogic', editedItem.value.typeLogic);

                // Agregar la imagen si está presente
                if (editedItem.value.selectedLogo) {
                    formData.append('image', editedItem.value.selectedLogo);
                }

                // Llamada al servicio para actualizar el cliente
                await updateCustomersApi(token, formData, props.item._id);
                isLoading.value = false; // Ocultar pantalla de carga
                emit('close');  // Emitir el evento 'close' después de la actualización
            } catch (error) {
                console.error("Error updating customer:", error);
                isLoading.value = false;  // Ocultar pantalla de carga en caso de error
            }
        };

        return {
            editedItem,
            showPassword,
            togglePasswordVisibility,
            handleImageUpload,
            submitUpdate,
            isLoading,
        };
    },
};
</script>

<style scoped></style>
