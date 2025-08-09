<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="text-lg font-semibold text-gray-700 mb-4 text-center">Editar {{ nameArea }}</h2>
            <form @submit.prevent="submitUpdate">
                <!-- Nombre -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input type="text" v-model="editedItem.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>

                <!-- Layout -->
                <div class="mb-4">
                    <label for="countries" class="block text-sm font-medium text-gray-500 mb-1">
                        Seleccionar {{ NameLayout }}
                    </label>
                    <select id="countries" v-model="editedItem.layout._id"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5">
                        <option v-for="layout in layouts" :key="layout._id" :value="layout._id">
                            {{ layout.name }}
                        </option>
                    </select>
                </div>

                <!-- Categorías (typeItemMobiles) -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Seleccionar Categorías</label>
                    <div class="mb-4 max-h-[10vh] overflow-y-auto">
                        <div class="mb-2">
                            <input type="checkbox" id="selectAll" @change="toggleSelectAll" :checked="isAllSelected" />
                            <label for="selectAll" class="ml-2 text-sm text-gray-600">Seleccionar Todos</label>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div v-for="ctag in ctangs" :key="ctag._id" class="flex items-center">
                                <input type="checkbox" :id="ctag._id" :value="ctag._id"
                                    v-model="editedItem.aforo.typeItemMobiles" />
                                <label :for="ctag._id" class="ml-2 text-sm text-gray-600">{{ ctag.name }}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Aforo Amount -->
                <div class="mb-4">
                    <label for="amount" class="block text-sm font-medium text-gray-500 mb-1">Aforo</label>
                    <input type="number" id="amount" v-model="editedItem.aforo.amount"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>


                <!-- Aforo Amount -->
                <div class="mb-4">
                    <label for="amount" class="block text-sm font-medium text-gray-500 mb-1">Tiempo de
                        permanencia</label>
                    <select id="amount" v-model="editedItem.dwellTime"
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
                    <input type="color" id="color" v-model="editedItem.color"
                        class="w-full border border-gray-300 rounded-lg h-10 px-3 cursor-pointer focus:ring-2 focus:ring-[#497fae] focus:border-[#497fae]" />
                </div>

                <!-- Botones -->
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
import { ref, watch, onMounted, computed } from 'vue';
import { listLayoutApi } from '@/api/LayoutService';
import { listCTagApi } from '@/api/CTagService';
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
        const NameLayout = store.getters.getItemName('Layouts');
        const nameArea = store.getters.getItemName('Áreas');
        const editedItem = ref({ ...props.item });
        const layouts = ref([]);
        const ctangs = ref([]);

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

        watch(
            () => props.item,
            (newItem) => {
                editedItem.value = { ...newItem };
            }
        );

        const isAllSelected = computed(() =>
            ctangs.value.every((ctag) => editedItem.value.aforo.typeItemMobiles.includes(ctag._id))
        );

        const toggleSelectAll = () => {
            if (isAllSelected.value) {
                editedItem.value.aforo.typeItemMobiles = [];
            } else {
                editedItem.value.aforo.typeItemMobiles = ctangs.value.map((ctag) => ctag._id);
            }
        };

        const submitUpdate = () => {
            const updatedItem = {
                ...editedItem.value,
                layoutId: editedItem.value.layout._id,
            };
            delete updatedItem.layout;

            emit('updateItem', updatedItem);
        };


        onMounted(() => {
            listLayout();
            listCtags();
        });

        return {
            editedItem,
            submitUpdate,
            listLayout,
            listCtags,
            layouts,
            ctangs,
            nameArea,
            NameLayout,
            isAllSelected,
            toggleSelectAll,
        };
    },
};
</script>
