<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class=" bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Crear {{ nameAntenna }}</h2>
            <form @submit.prevent="submitForm">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Mac</label>
                    <input type="text" v-model="form.mac"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>

                <div class="mb-4">
                    <label for="countries" class="block text-sm font-medium text-gray-500 mb-1">
                        Seleccionar {{nameArea}}
                    </label>
                    <select id="countries" v-model="form.areaId"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-#497fae-500 dark:focus:border-#497fae-500">

                        <option v-for="area in areas" :key="area._id" :value="area._id">
                            {{ area.name }}
                        </option>
                    </select>
                </div>

                <div class="mb-4">
                    <label for="countries" class="block text-sm font-medium text-gray-500 mb-1">
                        Seleccionar categoria de {{nameAntenna}}
                    </label>
                    <select id="countries" v-model="form.typeId"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-#497fae-500 dark:focus:border-#497fae-500">

                        <option v-for="cantenna in cantennas" :key="cantenna._id" :value="cantenna._id">
                            {{ cantenna.name }}
                        </option>
                    </select>
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
import { onMounted, ref } from 'vue';
import { listAreasApi } from '@/api/AreaService'
import { listCAntennaApi } from '@/api/CAntennaService'
import store from '@/store';

export default {
    emits: ['close', 'ItemCreate'],
    setup(props, { emit }) {
        const nameAntenna = store.getters.getItemName('Puntos de área')
        const nameArea = store.getters.getItemName('Áreas')
        const item = ref(true);
        const areas = ref([])
        const cantennas = ref([])
        const form = ref({
            name: '',
            areaId: '',
            typeId: ''

        });

        const listAreas = async () => {
            try {
                const token = store.state.token
                const response = await listAreasApi(token)
                if (response) {
                    areas.value = response.data.data
                    console.log("listado de areas correctamente")

                }
            } catch (error) {
                console.assert("erro al listar areas")
            }
        }

        const listCAntenna = async () => {
            try {
                const token = store.state.token
                const response = await listCAntennaApi(token);
                if (response) {
                    cantennas.value = response.data.data
                }
            } catch (error) {
                console.log("error al listar categoria de antenas xd.")
            }
        }
        const closeDialog = () => {
            emit('close');
        };


        const submitForm = async () => {
            emit('ItemCreate', form.value)
        };

        onMounted(
            listAreas(),
            listCAntenna()
        )

        return {
            item,
            form,
            closeDialog,
            submitForm,
            listAreas,
            areas,
            listCAntenna,
            cantennas,
            nameAntenna,
            nameArea
        };
    }
};
</script>

<style scoped></style>