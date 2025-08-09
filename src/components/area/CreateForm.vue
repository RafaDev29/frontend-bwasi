<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Nuevo {{ nameArea }}</h2>
            <form @submit.prevent="submitForm">
                <!-- Nombre -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input type="text" v-model="form.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>

                <!-- Layout -->
                <div class="mb-4">
                    <label for="countries" class="block text-sm font-medium text-gray-500 mb-1">
                        Seleccionar {{ nameLayout }}
                    </label>
                    <select id="countries" v-model="form.layoutId"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5">
                        <option v-for="layout in layouts" :key="layout._id" :value="layout._id">
                            {{ layout.name }}
                        </option>
                    </select>
                </div>

                <!-- Categorías (typeItemMobiles) -->
                <label class="block text-sm font-medium text-gray-500 mb-1">Seleccionar Categorías</label>
                <div class="mb-4 max-h-[10vh] overflow-y-auto">

                    <div class="mb-2">
                        <input type="checkbox" id="selectAll" @change="toggleSelectAll" :checked="isAllSelected" />
                        <label for="selectAll" class="ml-2 text-sm text-gray-600">Seleccionar Todos</label>
                    </div>
                    <div class="grid grid-cols-2 gap-2 " style="max-height: 200px;">
                        <div v-for="ctag in ctangs" :key="ctag._id" class="flex items-center">
                            <input type="checkbox" :id="ctag._id" :value="ctag._id"
                                v-model="form.aforo.typeItemMobiles" />
                            <label :for="ctag._id" class="ml-2 text-sm text-gray-600">{{ ctag.name }}</label>
                        </div>
                    </div>
                </div>


                <!-- Aforo Amount -->
                <div class="mb-4">
                    <label for="amount" class="block text-sm font-medium text-gray-500 mb-1">Aforo</label>
                    <input type="number" id="amount" v-model="form.aforo.amount"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>


                <!-- Aforo Amount -->
                <div class="mb-4">
                    <label for="amount" class="block text-sm font-medium text-gray-500 mb-1">Tiempo de
                        permanencia</label>
                    <select id="amount" v-model="form.dwellTime"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-[#497fae] focus:border-[#497fae]"
                        required>
                        <option v-for="time in [5, 10, 15, 20, 25, 30]" :key="time" :value="time">
                            {{ time }} segundos
                        </option>
                    </select>
                </div>


                <!-- Selector de Color -->
                <div class="mb-4">
                    <label for="color" class="block text-sm font-medium text-gray-500 mb-1">Color</label>
                    <input type="color" id="color" v-model="form.color"
                        class="w-full border border-gray-300 rounded-lg h-10 px-3 cursor-pointer focus:ring-2 focus:ring-[#497fae] focus:border-[#497fae]" />
                </div>



                <!-- Botones -->
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
import { onMounted, ref, computed } from 'vue';
import { listLayoutApi } from '@/api/LayoutService';
import { listCTagApi } from '@/api/CTagService';
import store from '@/store';

export default {
    emits: ['close', 'ItemCreate'],
    setup(props, { emit }) {
        const nameArea = store.getters.getItemName('Áreas');
        const nameLayout = store.getters.getItemName('Layouts');

        const item = ref(true);
        const layouts = ref([]);
        const ctangs = ref([]);
        const form = ref({
            name: '',
            layoutId: '',
            aforo: {
                typeItemMobiles: [],
                amount: 0,
            },
            dwellTime: 10,
            color: "#497fae"
        });

        const listLayout = async () => {
            const token = store.state.token;
            const response = await listLayoutApi(token);
            layouts.value = response.data.data;
        };

        const listCtags = async () => {
            const token = store.state.token;
            const response = await listCTagApi(token);
            ctangs.value = response.data.data;
        };

        const closeDialog = () => {
            emit('close');
        };

        const submitForm = async () => {
            emit('ItemCreate', form.value);
        };

        // "Seleccionar Todos" lógica
        const isAllSelected = computed(() =>
            ctangs.value.every((ctag) => form.value.aforo.typeItemMobiles.includes(ctag._id))
        );

        const toggleSelectAll = () => {
            if (isAllSelected.value) {
                form.value.aforo.typeItemMobiles = [];
            } else {
                form.value.aforo.typeItemMobiles = ctangs.value.map((ctag) => ctag._id);
            }
        };

        onMounted(() => {
            listLayout();
            listCtags();
        });

        return {
            item,
            form,
            closeDialog,
            submitForm,
            listLayout,
            layouts,
            nameArea,
            nameLayout,
            listCtags,
            ctangs,
            isAllSelected,
            toggleSelectAll,
        };
    },
};
</script>

<style scoped></style>
