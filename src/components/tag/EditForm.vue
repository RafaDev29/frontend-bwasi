<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9990]">
        <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-gray-700 mb-4 text-center">Editar {{nameTag}}</h2>

            <form @submit.prevent="submitUpdate">

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input type="text" v-model="editedItem.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Identificador</label>
                    <input type="text" v-model="editedItem.identifier"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500" />
                </div>



                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">MAC</label>
                    <input type="text" v-model="editedItem.mac"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>



                <spam class="block text-sm font-bold text-gray-500 mb-1">Datos del Primer apoderado:</spam>

                <div class="flex space-x-4 mb-4">
                    <!-- Campo Nombre del Apoderado -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                        <input type="text" v-model="editedItem.proxyName"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500" />
                    </div>

                    <!-- Campo Teléfono del Apoderado -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                        <input type="number" v-model="editedItem.proxyPhone" @input="editedItem.proxyPhone = editedItem.proxyPhone.toString().slice(0, 9)"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500" />
                    </div>


                </div>
                <!-- Campo Email del Apoderado -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Correo</label>
                    <input type="email" v-model="editedItem.proxyEmail"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500" />
                </div>

                <spam class="block text-sm font-bold text-gray-500 mb-1">Datos del segundo apoderado:</spam>

                <div class="flex space-x-4 mb-4">
                    <!-- Campo Nombre del Apoderado -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                        <input type="text" v-model="editedItem.proxyName2"  @input="editedItem.proxyName2 = editedItem.proxyName2.toString().slice(0, 9)"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500" />
                    </div>

                    <!-- Campo Teléfono del Apoderado -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                        <input type="number" v-model="editedItem.proxyPhone2"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500" />
                    </div>


                </div>
                <!-- Campo Email del Apoderado -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Correo</label>
                    <input type="email" v-model="editedItem.proxyEmail2"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500" />
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
import { ref, watch, onMounted } from "vue";
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
        const nameTag = store.getters.getItemName('Items Moviles')
        const editedItem = ref({ ...props.item });
        const catags = ref([]);
        const isDropdownOpen = ref(false);

        // Lista de iconos disponibles
        const icons = ref([
            "fa-solid fa-user",
            "fa-solid fa-user-tie",
            "fa-solid fa-user-nurse",
            "fa-solid fa-user-graduate",
            "fa-solid fa-car",
            "fa-solid fa-bicycle",
            "fa-solid fa-truck",
            "fa-solid fa-ship",
            "fa-solid fa-plane",
            "fa-solid fa-train",
            "fa-solid fa-bus",
            "fa-solid fa-heart",
            "fa-solid fa-house",
            "fa-solid fa-flag",
            "fa-solid fa-tree",
            "fa-solid fa-book",
            "fa-solid fa-vial-virus",
            "fa-solid fa-microscope",
            "fa-solid fa-flask-vial",
            "fa-solid fa-vial"
        ]);

        watch(
            () => props.item,
            (newItem) => {
                editedItem.value = { ...newItem };
            }
        );

        const listLayout = async () => {
            try {
                const token = store.state.token;
                const response = await listCTagApi(token);
                catags.value = response.data.data;
            } catch (error) {
                console.error("Error al obtener layouts");
            }
        };

        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        const selectIcon = (icon) => {
            editedItem.value.icon = icon;
            isDropdownOpen.value = false;
        };

        const submitUpdate = () => {
            emit("updateItem", editedItem.value);
        };

        onMounted(() => {
            listLayout();
        });



        return {
            editedItem,
            catags,
            isDropdownOpen,
            toggleDropdown,
            selectIcon,
            submitUpdate,
            icons,
            nameTag
        };
    },
};
</script>
