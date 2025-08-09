<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9990]">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Crear Nueva cliente</h2>
            <form @submit.prevent="submitForm">
                <!-- Campo Nombre -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input 
                        type="text" 
                        v-model="form.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required
                    />
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Razón social</label>
                    <input 
                        type="text" 
                        v-model="form.businessName"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required
                    />
                </div>

                <!-- Campo RUC -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">RUC</label>
                    <input 
                        type="text" 
                        v-model="form.ruc"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required
                    />
                </div>

                <!-- Campo Tipo de Lógica -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Tipo de configuración</label>
                    <select 
                        v-model="form.typeLogic"
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
                    <input 
                        type="text" 
                        v-model="form.username"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required
                    />
                </div>

                <!-- Campo Contraseña -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Contraseña</label>
                    <input 
                        type="password" 
                        v-model="form.password"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required
                    />
                </div>

                <!-- Campo Imagen -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Imagen</label>
                    <input 
                        type="file" 
                        @change="handleImageUpload"
                        class="w-full text-gray-700"
                        accept="image/*"
                    />
                </div>

                <!-- Botones de Acción -->
                <div class="flex justify-end space-x-2">
                    <button 
                        type="button" 
                        @click="closeDialog"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        class="px-4 py-2 bg-[#396895] text-white rounded-lg hover:bg-[#396895]"
                    >
                        Guardar
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
import { ref } from 'vue';
import { createCustomersApi } from '@/api/CompanyService';
import store from '@/store';

export default {
    emits: ['close'],
    setup(props, { emit }) {
        const isLoading = ref(false);
        const item = ref(true);
        const form = ref({
            name: '',
            businessName: '',
            ruc: '',
            typeLogic: '',  // default will be an empty string
            username: '',
            password: '',
            image: null, // File object for the image
        });

        const openLoading = () => {
            isLoading.value = true;
        }
        const closeLoading = () => {
            isLoading.value = false;
        }
        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                form.value.image = file;
            }
        };

        const closeDialog = () => {
            emit('close');
        };

        const submitForm = async () => {
            openLoading();
            try {
                const token = store.state.token;
                const formData = new FormData();
                formData.append('name', form.value.name);
                formData.append('businessName', form.value.businessName);
                formData.append('ruc', form.value.ruc);
                formData.append('typeLogic', form.value.typeLogic);
                formData.append('username', form.value.username);
                formData.append('password', form.value.password);
                if (form.value.image) {
                    formData.append('image', form.value.image);
                }

                // Llamada al servicio para crear el cliente
                await createCustomersApi(token, formData);
                closeLoading();
                // Emitir el evento 'close' sin pasar datos
                emit('close');
            } catch (error) {
                console.error("Error creating customer:", error);
                closeLoading();
            }
        };

        return {
            item,
            form,
            handleImageUpload,
            closeDialog,
            submitForm,
            isLoading,
            openLoading,
            closeLoading
        };
    }
};
</script>

<style scoped></style>
