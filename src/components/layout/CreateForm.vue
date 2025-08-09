<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class=" bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Nuevo {{ NameLayout }}</h2>
            <form @submit.prevent="submitForm">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input type="text" v-model="form.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>


                <div class="flex justify-end space-x-2">
                    <button type="button" @click="closeDialog"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-[#396895] text-white rounded-lg hover:bg-[#396895]">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import store from '@/store';

export default {
    emits: ['close', 'ItemCreate'],
    setup(props, { emit }) {
        const NameLayout = store.getters.getItemName('Layouts');
        const item = ref(true);
        const form = ref({
            name: '',
        });

        const closeDialog = () => {
            emit('close');
        };


        const submitForm = async () => {
            emit('ItemCreate', form.value)
        };

        return {
            item,
            form,
            closeDialog,
            submitForm,
            NameLayout
        };
    }
};
</script>

<style scoped></style>