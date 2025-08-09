<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
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
</template>

<script>
import { ref, watch } from 'vue';

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

        // Enviar los datos editados
        const submitUpdate = () => {
            emit('updateItem', editedItem.value);
        };

        return {
            editedItem,
            showPassword,
            togglePasswordVisibility,
            submitUpdate,
        };
    },
};
</script>

<style scoped></style>
