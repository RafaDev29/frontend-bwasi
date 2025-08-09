<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="text-lg font-semibold text-gray-700 mb-4 text-center ">Editar {{nameAntenna}}</h2>
            <form @submit.prevent="submitUpdate">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input type="text" v-model="editedItem.mac"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>



                <div class="mb-4">
                    <label for="countries" class="block text-sm font-medium text-gray-500 mb-1">
                        Seleccionar {{nameArea}}
                    </label>
                    <select id="countries" v-model="editedItem.area._id"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-#497fae-500 dark:focus:border-#497fae-500">
             
                        <option v-for="area in areas" :key="area._id" :value="area._id">
                            {{ area.name }}
                        </option>
                    </select>
                </div>
                <div class="mb-4">
                    <label for="countries" class="block text-sm font-medium text-gray-500 mb-1">
                        Seleccionar Categoria de {{ nameAntenna }}
                    </label>
                    <select id="countries" v-model="editedItem.typeId._id"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-#497fae-500 dark:focus:border-#497fae-500">
    
                        <option v-for="typeId in typeIds" :key="typeId._id" :value="typeId._id">
                            {{ typeId.name }}
                        </option>
                    </select>
                </div>
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
import { ref, watch, onMounted } from 'vue';

import { listAreasApi } from '@/api/AreaService'
import { listCAntennaApi } from '@/api/CAntennaService'
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
        const nameAntenna = store.getters.getItemName('Puntos de área')
        const nameArea = store.getters.getItemName('Áreas')

        const editedItem = ref({
            ...props.item,
            typeId: props.item.typeId || { _id: '', name: '' }
        });

        const areas = ref([]);
        const typeIds = ref([]);
        watch(
            () => props.item,
            (newItem) => {
                editedItem.value = { ...newItem };
            }
        );

        const listAreas = async () => {
            try {
                const token = store.state.token
                const response = await listAreasApi(token)
                areas.value = response.data.data
            } catch (error) {
                console.log("error al obtener areas")
            }

        }

        const listCAntenna = async () => {

            try {
                const token = store.state.token
                const response = await listCAntennaApi(token);
                typeIds.value = response.data.data
                if (response) {
                    console.log("se listo las categorias cone xito")

                }
            } catch (error) {
                console.error("error al listar categoria ")
            }
        }

        watch(
            () => editedItem.value.area._id,
            (newAreaId) => {
                const selectedArea = areas.value.find(area => area._id === newAreaId);
                if (selectedArea) {
                    editedItem.value.area = { ...selectedArea };
                }
            }
        );


        watch(
            () => editedItem.value.typeId._id,
            (newTypeId) => {
                const selecTypeId = typeIds.value.find(typeId => typeId._id === newTypeId);
                if (selecTypeId) {
                    editedItem.value.typeId = { ...selecTypeId }
                }
            }

        )


        const submitUpdate = () => {
            emit('updateItem', editedItem.value);

            console.log("assssssssssssssssssssssss")

        };
        onMounted(
            listAreas(),
            listCAntenna()
        )

        return {
            editedItem,
            submitUpdate,
            listAreas,
            areas,
            listCAntenna,
            typeIds,
            nameAntenna,
            nameArea
        };
    },
};
</script>
