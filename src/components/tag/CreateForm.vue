<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50  z-[9990]">
        <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Crear {{ nameTags }}</h2>

            <form @submit.prevent="submitForm">
                <!-- Nombre -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input type="text" v-model="form.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500"
                        required />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Identificador</label>
                    <input type="text" v-model="form.identifier"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500"
                        required />
                </div>

              




                <!-- Otros campos -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">MAC</label>
                    <input type="text" v-model="form.mac"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500"
                        required />
                </div>

                <spam class="block text-sm font-bold text-gray-500 mb-1">Datos del primer apoderado:</spam>
                <div class="flex space-x-4 mb-4">
                    <!-- Campo Nombre del apoderado -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input type="text" v-model="form.proxyName"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500"
                            required />
                    </div>

                    <!-- Campo Teléfono del apoderado -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="number" v-model="form.proxyPhone"
                            @input="form.proxyPhone = form.proxyPhone.toString().slice(0, 9)"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500"
                            required />
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                    <input type="email" v-model="form.proxyEmail"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500"
                        required />
                </div>


                <spam class="block text-sm font-bold text-gray-500 mb-1">Datos del segundo apoderado:</spam>
                <div class="flex space-x-4 mb-4">
                    <!-- Campo Nombre del apoderado -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input type="text" v-model="form.proxyName2"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500" />
                    </div>

                    <!-- Campo Teléfono del apoderado -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="number" v-model="form.proxyPhone2"
                            @input="form.proxyPhone2 = form.proxyPhone2.toString().slice(0, 9)"
                            class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500" />
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                    <input type="email" v-model="form.proxyEmail2"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-#497fae-500" />
                </div>





                <!-- Botones -->
                <div class="flex justify-end space-x-3">
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
import { ref } from "vue";
// import { listCTagApi } from "@/api/CTagService";
import store from "@/store";


export default {
    emits: ["close", "ItemCreate"],
    setup(_, { emit }) {
        const nameTags = store.getters.getItemName('Items Moviles')
        const item = ref(true);
        const isDropdownOpen = ref(false);
        const icons = ref([
            "fa-solid fa-user",
            "fa-solid fa-user-tie",
            "fa-solid fa-user-nurse",
            "fa-solid fa-user-graduate",
            "fa-solid fa-car",
            "fa-solid fa-bicycle",
            "fa-solid fa-truck",
            "fa-solid fa-bus",
            "fa-solid fa-heart",
            "fa-solid fa-house",
            "fa-solid fa-flag",

            "fa-solid fa-book",
            "fa-solid fa-vial-virus",
            "fa-solid fa-microscope",
            "fa-solid fa-flask-vial",
            "fa-solid fa-vial"
        ]);

        const form = ref({
            name: "",
            // typeId: "",
            icon: "",
            color: "#0563b6",
            mac: "",
            proxyName: "",
            proxyEmail: "",
            proxyPhone: "",
            proxyName2: "",
            proxyEmail2: "",
            proxyPhone2: "",
            identifier: "",
        });



        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        const selectIcon = (icon) => {
            form.value.icon = icon;
            isDropdownOpen.value = false;
        };

        const closeDialog = () => {
            emit("close");
        };

        const submitForm = () => {
            emit("ItemCreate", form.value);
        };



        return {
            item,
            form,
            icons,
            nameTags,
            isDropdownOpen,
            toggleDropdown,
            selectIcon,
            closeDialog,
            submitForm,
        };
    },
};
</script>