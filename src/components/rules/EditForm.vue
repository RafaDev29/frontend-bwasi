<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6  max-h-[80vh] overflow-y-auto">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Editar regla</h2>
            <form @submit.prevent="submitForm">
                <div class="flex mb-4">

                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                        <input type="text" v-model="form.name"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-[#497fae] focus:border-[#497fae]"
                            required />
                    </div>

                    <div class="">
                        <label class="block text-sm font-bold text-gray-500 mb-3 ml-2">Estado</label>
                        <div class="flex items-center">

                            <input type="checkbox" v-model="form.status" class="toggle-checkbox ml-5" />

                        </div>
                    </div>

                </div>





                <div class="mb-4">
                    <label for="espacios" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un
                        tipo</label>
                    <select id="espacios" v-model="form.typeGateways"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#497fae] focus:border-[#497fae] block w-full p-2.5">

                        <option value="LAYOUT">Layouts</option>
                        <option value="AREA">Áreas</option>
                        <option value="GROUP_AREAS">Grupo de Áreas</option>
                    </select>
                </div>

                <div class="mb-4 max-h-[20vh] overflow-y-auto" v-if="layouts.length > 0">
                    <label class="block text-sm font-medium text-gray-500 mb-2">Seleccionar opciones</label>
                    <input 
      type="text"  
      v-model="searchQuery" 
      placeholder="Buscar opciones..." 
      class="w-full p-2 border border-gray-300 rounded mb-4 text-sm"
    />
                    <div v-for="layout in filteredLayouts" :key="layout._id" class="flex items-center space-x-2">
                        <input type="checkbox" :value="layout._id" v-model="selectedGateways" />
                        <label class="text-sm text-gray-700">{{ layout.name }}</label>
                    </div>
                </div>

                <div class="mb-4">
                    <label for="etiquetas" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un
                        tipo</label>
                    <select id="etiquetas" v-model="form.typeItemsMobiles"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#497fae] focus:border-[#497fae] block w-full p-2.5">

                        <option value="GROUP_ITEMMOBILE">Grupo de Etiquetas</option>
                        <option value="TYPE_ITEMMOBILE">Categoría de Etiquetas</option>
                    </select>
                </div>

                <div class="mb-4 max-h-[20vh] overflow-y-auto" v-if="etiquetas.length > 0">
                    <label class="block text-sm font-medium text-gray-500 mb-2">Seleccionar opciones</label>
                    <input 
      type="text"  
      v-model="searchQuery2" 
      placeholder="Buscar opciones..." 
      class="w-full p-2 border border-gray-300 rounded mb-4 text-sm"
    />
                    <div v-for="etiqueta in filteredEtiquetas" :key="etiqueta._id" class="flex items-center space-x-2">
                        <input type="checkbox" :value="etiqueta._id" v-model="selectTags" />
                        <label class="text-sm text-gray-700">{{ etiqueta.name }}</label>
                    </div>
                </div>

                <div class="mb-4">
                    <label for="tipo" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un tipo</label>
                    <select id="tipo" v-model="form.type"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#497fae] focus:border-[#497fae] block w-full p-2.5">

                        <option value="ENTRADA">Entrada</option>
                        <option value="SALIDA">Salida</option>
                      
                    </select>
                </div>

                <div class="mb-4" v-if="form.type == 'PERMANENCIA'">
                    <label for="timeLimit" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un
                        tiempo</label>
                    <input type="time" step="1" value="00:00:00" v-model="form.timeLimit"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#497fae] focus:border-[#497fae] block w-full p-2.5"
                        required />
                </div>

               

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-900 mb-3">Seleccionar Notificaciones</label>
                    <div class="flex flex-col">
                        <!-- Checkbox EMAIL -->
                        <div class="flex items-center space-x-3 mb-4">
                            <input type="checkbox" value=true v-model="form.typeContact.email.status" id="email-notification"
                                class="cursor-pointer accent-[#497fae] w-4 h-4" />
                            <label for="email-notification"
                                class="text-sm text-gray-700 cursor-pointer flex items-center">
                                <i class="fa fa-envelope text-[#497fae] mr-2"></i> Email
                            </label>
                        </div>

                        <!-- Email Details -->
                        <div v-if="form.typeContact.email.status" class="pl-5 border-l-2 border-[#497fae]">
                            <label class="block text-sm font-medium text-gray-500 mb-2">Seleccionar
                                Destinatarios</label>
                            <div class="flex gap-5 mb-4">
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" value="PROXY" v-model="form.typeContact.email.range"
                                        id="email-proxy" class="cursor-pointer accent-[#497fae] w-4 h-4" />
                                    <label for="email-proxy"
                                        class="text-sm text-gray-700 cursor-pointer">Apoderados</label>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" value="PERSONALIZED" v-model="form.typeContact.email.range"
                                        id="email-personalized" class="cursor-pointer accent-[#497fae] w-4 h-4" />
                                    <label for="email-personalized"
                                        class="text-sm text-gray-700 cursor-pointer">Personalizado</label>
                                </div>
                            </div>

                            <!-- Personalized Emails -->
                            <div v-if="form.typeContact.email.range.includes('PERSONALIZED')" class="ml-5 max-h-[20vh] overflow-y-auto">
                                <div v-for="(email, index) in form.typeContact.email.items" :key="index"
                                    class="flex items-center mb-2 space-x-2">
                                    <input type="text" :id="'email-input-' + index" v-model="form.typeContact.email.items[index]"
                                        class="flex-grow bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#497fae] focus:border-#497fae-500 block w-full p-2 shadow-sm transition-all duration-200"
                                        placeholder="sysnet@gmail.com" required />
                                    <button type="button" @click="removeEmail(index)"
                                        class="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-all duration-200">
                                        <i class="mdi mdi-trash-can-outline text-lg"></i>
                                    </button>
                                </div>
                                <button type="button" @click="addEmail"
                                    class="mt-3 flex items-center px-2 py-1 bg-[#396895] text-white font-medium text-xs rounded-lg shadow-md hover:bg-[#396895] focus:ring-2 focus:ring-[#497fae] focus:outline-none transition-all duration-200">
                                    <i class="mdi mdi-plus-circle-outline text-sm mr-2"></i>
                                    Agregar Correo
                                </button>
                            </div>
                        </div>

                        <!-- Checkbox WHATSAPP -->
                        <div class="flex items-center space-x-3 mt-4">
                            <input type="checkbox" value=true v-model="form.typeContact.whatsapp.status" id="whatsapp-notification"
                                class="cursor-pointer accent-#099cb4-500 w-4 h-4" />
                            <label for="whatsapp-notification"
                                class="text-sm text-gray-700 cursor-pointer flex items-center">
                                <i class="fa fa-whatsapp text-[#099cb4] mr-2"></i> WhatsApp
                            </label>
                        </div>

                        <!-- WhatsApp Details -->
                        <div v-if="form.typeContact.whatsapp.status" class="pl-5 border-l-2 border-#099cb4-300">
                            <label class="block text-sm font-medium text-gray-500 mb-2">Seleccionar
                                Destinatarios</label>
                            <div class="flex gap-5 mb-4">
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" value="PROXY" v-model="form.typeContact.whatsapp.range"
                                        id="whatsapp-proxy" class="cursor-pointer accent-#099cb4-500 w-4 h-4" />
                                    <label for="whatsapp-proxy"
                                        class="text-sm text-gray-700 cursor-pointer">Apoderados</label>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" value="PERSONALIZED" v-model="form.typeContact.whatsapp.range"
                                        id="whatsapp-personalized" class="cursor-pointer accent-#099cb4-500 w-4 h-4" />
                                    <label for="whatsapp-personalized"
                                        class="text-sm text-gray-700 cursor-pointer">Personalizado</label>
                                </div>
                            </div>

                            <!-- Personalized Numbers -->
                            <div v-if="form.typeContact.whatsapp.range.includes('PERSONALIZED')" class="ml-5 max-h-[20vh] overflow-y-auto">
                                <div v-for="(number, index) in form.typeContact.whatsapp.items" :key="index"
                                    class="flex items-center mb-2 space-x-2">
                                    <input type="text" :id="'phone-input-' + index" v-model="form.typeContact.whatsapp.items[index]"
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
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref, watch , computed} from "vue";
import { listLayoutApi } from "@/api/LayoutService";
import { listAreasApi } from "@/api/AreaService";
import { listGAreasApi } from "@/api/GAreaService";
import { listGTagsApi } from "@/api/GTagService";
import { listCTagApi } from "@/api/CTagService";
import store from "@/store";

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    emits: ["close", "updateItem"],
    setup(props, { emit }) {
        const form = ref({ ...props.item });
        const layouts = ref([]);
        const etiquetas = ref([]);
        const selectedGateways = ref([...props.item.gateways]);
        const selectTags = ref([...props.item.itemsMobiles]);
        const searchQuery2 = ref("");
        const searchQuery = ref("");
        const filteredEtiquetas = computed(() => {
      const query = searchQuery2.value.toLowerCase();
      return etiquetas.value.filter((etiqueta) =>
        etiqueta.name.toLowerCase().includes(query)
      );
    });

    const filteredLayouts = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return layouts.value.filter((layout) =>
        layout.name.toLowerCase().includes(query)
      );
    });
        const closeDialog = () => {
            emit("close");
        };

        const submitForm = () => {
            emit("updateItem", { ...form.value, gateways: selectedGateways.value, itemsMobiles: selectTags.value });
        };

        const fetchDataByType = async (type) => {
            const token = store.state.token;
            if (type === "LAYOUT") layouts.value = (await listLayoutApi(token)).data.data;
            if (type === "AREA") layouts.value = (await listAreasApi(token)).data.data;
            if (type === "GROUP_AREAS") layouts.value = (await listGAreasApi(token)).data.data;
        };

        const fetchDataByTags = async (type) => {
            const token = store.state.token;
            if (type === "GROUP_ITEMMOBILE") etiquetas.value = (await listGTagsApi(token)).data.data;
            if (type === "TYPE_ITEMMOBILE") etiquetas.value = (await listCTagApi(token)).data.data;
        };

        watch(() => form.value.typeGateways, fetchDataByType);
        watch(() => form.value.typeItemsMobiles, fetchDataByTags);

        const addEmail = () => form.value.typeContact.email.items.push("");
        const removeEmail = (index) => form.value.typeContact.email.items.splice(index, 1);
        const addNumber = () => form.value.typeContact.whatsapp.items.push("");
        const removeNumber = (index) => form.value.typeContact.whatsapp.items.splice(index, 1);

        fetchDataByType(form.value.typeGateways);
        fetchDataByTags(form.value.typeItemsMobiles);

        return { form, layouts, etiquetas, selectedGateways, selectTags, closeDialog, submitForm,filteredLayouts, addEmail, removeEmail, addNumber, removeNumber, filteredEtiquetas, searchQuery2, searchQuery };
    },
};
</script>


<style>
.toggle-checkbox {
    width: 40px;
    height: 20px;
    appearance: none;
    background: #ddd;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    outline: none;
    transition: background 0.3s;
}

.toggle-checkbox:checked {
    background: #4caf50;
}

.toggle-checkbox:before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    top: 1px;
    left: 1px;
    transition: left 0.3s;
}

.toggle-checkbox:checked:before {
    left: 21px;
}
</style>