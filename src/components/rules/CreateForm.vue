<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9990]">
        <div class=" bg-white rounded-lg shadow-lg max-w-md w-full p-6  max-h-[80vh] overflow-y-auto">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Crear Nueva regla</h2>
            <form @submit.prevent="submitForm">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input type="text" v-model="form.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>

                <div class="mb-4">
                    <label for="espacios" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un
                        tipo</label>
                    <select id="espacios" v-model="form.typeGateways"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5">
                        <option value="LAYOUT">Layouts</option>
                        <option value="AREA">Áreas</option>
                        <option value="GROUP_AREAS">Grupo de áreas</option>
                    </select>
                </div>

                <div class="mb-4 max-h-[20vh] overflow-y-auto" v-if="layouts.length > 0">
                    <label class="block text-sm font-medium text-gray-500 mb-2">Seleccionar opciones</label>
                    <!-- Buscador -->
                    <input type="text" v-model="searchQuery" placeholder="Buscar opciones..."
                        class="w-full p-2 border border-gray-300 rounded mb-4 text-sm" />
                    <!-- Listado de opciones filtradas -->
                    <div v-for="layout in filteredLayouts" :key="layout._id" class="flex items-center space-x-2">
                        <input type="checkbox" :value="layout._id" v-model="selectedGateways" />
                        <label class="text-sm text-gray-700">{{ layout.name }}</label>
                    </div>
                </div>

                <div class="mb-4">
                    <label for="espacios" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un
                        tipo</label>
                    <select id="espacios" v-model="form.typeItemsMobiles"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#497fae] focus:border-[#497fae] block w-full p-2.5">

                        <option value="GROUP_ITEMMOBILE">Grupo de Etiquetas</option>
                        <option value="TYPE_ITEMMOBILE">Categoria de Etiquetas</option>

                    </select>
                </div>

                <div class="mb-4 max-h-[20vh] overflow-y-auto" v-if="etiquetas.length > 0">
                    <label class="block text-sm font-medium text-gray-500 mb-2">Seleccionar opciones</label>

                    <!-- Buscador -->
                    <input type="text" v-model="searchQuery2" placeholder="Buscar opciones..."
                        class="w-full p-2 border border-gray-300 rounded mb-4 text-sm" />

                    <!-- Listado filtrado -->
                    <div v-for="etiqueta in filteredEtiquetas" :key="etiqueta._id" class="flex items-center space-x-2">
                        <input type="checkbox" :value="etiqueta._id" v-model="selectTags" />
                        <label class="text-sm text-gray-700">{{ etiqueta.name }}</label>
                    </div>
                </div>
                <div class="mb-4">
                    <label for="tipo" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un evento</label>
                    <select id="tipos" v-model="form.type"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5">

                        <option value="ENTRADA">Entrada</option>
                        <option value="SALIDA">Salida</option>
                        

                    </select>
                </div>



                <div class="mb-4" v-if="form.type == 'PERMANENCIA'">
                    <label for="tipo" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un tiempo</label>
                    <div class="relative">
                        <input type="time" step="1" v-model="form.timeLimit"
                            class="bg-black-50 border leading-none border-black-300 text-black-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-#497fae-500 dark:focus:border-#497fae-500"
                            value="00:00:00" required />
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-900 mb-3">Seleccionar Notificaciones</label>
                    <div class="flex flex-col">
                        <!-- Checkbox EMAIL -->
                        <div class="flex items-center space-x-3 mb-4">
                            <input type="checkbox" value=true v-model="form.EmailStatus" id="email-notification"
                                class="cursor-pointer accent-[#497fae] w-4 h-4" />
                            <label for="email-notification"
                                class="text-sm text-gray-700 cursor-pointer flex items-center">
                                <i class="fa fa-envelope text-[#497fae] mr-2"></i> Email
                            </label>
                        </div>

                        <!-- Email Details -->
                        <div v-if="form.EmailStatus" class="pl-5 border-l-2 border-#497fae-300">
                            <label class="block text-sm font-medium text-gray-500 mb-2">Seleccionar
                                Destinatarios</label>
                            <div class="flex gap-5 mb-4">
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" value="PROXY" v-model="form.typeContactEmail"
                                        id="email-proxy" class="cursor-pointer accent-#497fae-500 w-4 h-4" />
                                    <label for="email-proxy"
                                        class="text-sm text-gray-700 cursor-pointer">Apoderados</label>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" value="PERSONALIZED" v-model="form.typeContactEmail"
                                        id="email-personalized" class="cursor-pointer accent-#497fae-500 w-4 h-4" />
                                    <label for="email-personalized"
                                        class="text-sm text-gray-700 cursor-pointer">Personalizado</label>
                                </div>
                            </div>

                            <!-- Personalized Emails -->
                            <div v-if="form.typeContactEmail.includes('PERSONALIZED')"
                                class="ml-5 max-h-[20vh] overflow-y-auto">
                                <div v-for="(email, index) in form.emails" :key="index"
                                    class="flex items-center mb-2 space-x-2">
                                    <input type="text" :id="'email-input-' + index" v-model="form.emails[index]"
                                        class="flex-grow bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2 shadow-sm transition-all duration-200"
                                        placeholder="sysnet@gmail.com" required />
                                    <button type="button" @click="removeEmail(index)"
                                        class="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-all duration-200">
                                        <i class="mdi mdi-trash-can-outline text-sm"></i>
                                    </button>
                                </div>
                                <button type="button" @click="addEmail"
                                    class="mt-2 flex items-center px-2 py-1 bg-[#396895] text-white font-medium text-xs rounded-lg shadow-md hover:bg-[#396895] focus:ring-2 focus:ring-[#497fae] focus:outline-none transition-all duration-200">
                                    <i class="mdi mdi-plus-circle-outline text-sm mr-2 "></i>
                                    Agregar Correo
                                </button>
                            </div>
                        </div>

                        <!-- Checkbox WHATSAPP -->
                        <div class="flex items-center space-x-3 mt-4">
                            <input type="checkbox" value=true v-model="form.NumberStatus" id="whatsapp-notification"
                                class="cursor-pointer accent-#099cb4-500 w-4 h-4" />
                            <label for="whatsapp-notification"
                                class="text-sm text-gray-700 cursor-pointer flex items-center">
                                <i class="fa fa-whatsapp text-#099cb4-500 mr-2"></i> WhatsApp
                            </label>
                        </div>

                        <!-- WhatsApp Details -->
                        <div v-if="form.NumberStatus" class="pl-5 border-l-2 border-#099cb4-300">
                            <label class="block text-sm font-medium text-gray-500 mb-2">Seleccionar
                                Destinatarios</label>
                            <div class="flex gap-5 mb-4">
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" value="PROXY" v-model="form.typeContactNumber"
                                        id="whatsapp-proxy" class="cursor-pointer accent-#099cb4-500 w-4 h-4" />
                                    <label for="whatsapp-proxy"
                                        class="text-sm text-gray-700 cursor-pointer">Apoderados</label>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" value="PERSONALIZED" v-model="form.typeContactNumber"
                                        id="whatsapp-personalized" class="cursor-pointer accent-#099cb4-500 w-4 h-4" />
                                    <label for="whatsapp-personalized"
                                        class="text-sm text-gray-700 cursor-pointer">Personalizado</label>
                                </div>
                            </div>

                            <!-- Personalized Numbers -->
                            <div v-if="form.typeContactNumber.includes('PERSONALIZED')"
                                class="ml-5 max-h-[20vh] overflow-y-auto">
                                <div v-for="(number, index) in form.numbers" :key="index"
                                    class="flex items-center mb-2 space-x-2">
                                    <input type="text" :id="'phone-input-' + index" v-model="form.numbers[index]"
                                        class="flex-grow bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#497fae] focus:border-[#497fae] block w-full p-2 shadow-sm transition-all duration-200"
                                        placeholder="929831019" required />
                                    <button type="button" @click="removeNumber(index)"
                                        class="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-all duration-200">
                                        <i class="mdi mdi-trash-can-outline text-lg"></i>
                                    </button>
                                </div>
                                <button type="button" @click="addNumber"
                                    class="mt-3 flex items-center px-2 py-1 bg-[#099cb4] text-white font-medium text-xs rounded-lg shadow-md hover:bg-[#099cb4] focus:ring-2 focus:ring-[#099cb4] focus:outline-none transition-all duration-200">
                                    <i class="mdi mdi-plus-circle-outline text-sm mr-2"></i>
                                    Agregar Teléfono
                                </button>
                            </div>
                        </div>
                    </div>
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
import { ref, watch, computed } from 'vue';
import { listLayoutApi } from '@/api/LayoutService';
import { listAreasApi } from '@/api/AreaService';
import { listGAreasApi } from '@/api/GAreaService';
import { listGTagsApi } from '@/api/GTagService';
import { listCTagApi } from '@/api/CTagService';
import store from '@/store';

export default {
    emits: ['close', 'ItemCreate'],
    setup(props, { emit }) {
        const item = ref(true);
        const layouts = ref([]);
        const etiquetas = ref([]);
        const form = ref({
            name: '',
            typeGateways: '',
            typeItemsMobiles: '',
            type: '',
            timeLimit: '',
            NumberStatus: false,
            EmailStatus: false,
            emails: [],
            numbers: [],
            typeContact: [],
            status: true,
            typeContactNumber: [],
            typeContactEmail: []
        });


        const searchQuery = ref("");
        const searchQuery2 = ref("");

        const selectedGateways = ref([]);
        const selectTags = ref([]);

        const filteredLayouts = computed(() => {
            const query = searchQuery.value.toLowerCase();
            return layouts.value.filter((layout) =>
                layout.name.toLowerCase().includes(query)
            );
        });

        const filteredEtiquetas = computed(() => {
            const query = searchQuery2.value.toLowerCase();
            return etiquetas.value.filter((etiqueta) =>
                etiqueta.name.toLowerCase().includes(query)
            );
        });

        const listLayout = async () => {
            const token = store.state.token;
            const response = await listLayoutApi(token);
            layouts.value = response.data.data;
        };

        const listArea = async () => {
            const token = store.state.token;
            const response = await listAreasApi(token);
            layouts.value = response.data.data;
        };

        const listGArea = async () => {
            const token = store.state.token;
            const response = await listGAreasApi(token);
            layouts.value = response.data.data;
        };

        const listGTags = async () => {
            const token = store.state.token;
            const response = await listGTagsApi(token); // Corregir llamada
            etiquetas.value = response.data.data;
        };

        const listCTags = async () => {
            const token = store.state.token;
            const response = await listCTagApi(token); // Corregir llamada
            etiquetas.value = response.data.data;
        };

        const closeDialog = () => {
            emit('close');
        };


        const submitForm = () => {
            const finalObject = {
                name: form.value.name,
                gateways: selectedGateways.value,
                typeGateways: form.value.typeGateways,
                itemsMobiles: selectTags.value,
                typeItemsMobiles: form.value.typeItemsMobiles,
                type: form.value.type,
                timeLimit: form.value.timeLimit,
                typeNotification: form.value.typeNotification,

                typeContact: {
                    email: {
                        status: form.value.EmailStatus,
                        range: form.value.typeContactEmail,
                        items: form.value.emails
                    },
                    whatsapp: {
                        status: form.value.NumberStatus,
                        range: form.value.typeContactNumber,
                        items: form.value.numbers
                    }



                },
                status: form.value.status
            };
            console.log(finalObject); // Imprime el objeto final
            emit('ItemCreate', finalObject);
        };

        // Watch para detectar cambios en el tipo de gateways
        watch(
            () => form.value.typeGateways,
            async (newValue) => {
                selectedGateways.value = [];
                layouts.value = [];
                if (newValue === 'LAYOUT') {
                    await listLayout();
                } else if (newValue === 'AREA') {
                    await listArea();
                } else if (newValue === 'GROUP_AREAS') {
                    await listGArea();
                }
            }
        );

        // Watch para detectar cambios en el tipo de etiquetas
        watch(
            () => form.value.typeItemsMobiles,
            async (newValue) => {
                selectTags.value = [];
                etiquetas.value = []; // Limpiar etiquetas
                if (newValue === 'GROUP_ITEMMOBILE') {
                    await listGTags();
                } else if (newValue === 'TYPE_ITEMMOBILE') {
                    await listCTags();
                }
            }
        );
        const addNumber = () => {
            form.value.numbers.push(''); // Agrega un campo vacío para un nuevo número
        };

        const removeNumber = (index) => {
            form.value.numbers.splice(index, 1); // Elimina el número según el índice
        };

        const addEmail = () => {
            form.value.emails.push(''); // Agrega un campo vacío para un nuevo número
        };

        const removeEmail = (index) => {
            form.value.emails.splice(index, 1); // Elimina el número según el índice
        };

        return {
            item,
            form,
            closeDialog,
            submitForm,
            layouts,
            selectedGateways,
            selectTags,
            etiquetas,
            addNumber,
            removeNumber,
            addEmail,
            removeEmail,
            searchQuery,
            searchQuery2,
            filteredLayouts,
            filteredEtiquetas
        };
    },
};
</script>
