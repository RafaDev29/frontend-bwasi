<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]"
        @click="closeModal">
        <div class=" overflow-y-auto bg-white rounded-lg shadow-lg max-w-md w-full p-0"
            style="max-height: 80vh; margin-bottom: 1rem;">
            <!-- Encabezado -->
            <div class="flex justify-between items-center p-2 border-b bg-[#396895] text-white rounded-t-lg">
                <h1 class="text-xl   flex items-center">
                    <i class="mdi mdi-map-marker text-white text-3xl ml-2"></i>
                    {{NameArea}}
                </h1>

            </div>

            <div class="p-4">
                <ul class="divide-y divide-gray-300">
                    <li v-for="(area, index) in areas" :key="index" class="py-4 flex items-center space-x-4">



                        <div class="flex-1">
                            <p class="font-semibold text-gray-800">{{ area.name }} </p>
                        </div>

                    </li>
                </ul>
            </div>

            <!-- Pie de página -->
            <div class="flex justify-end p-4 border-t bg-gray-100 rounded-b-lg">
                <button @click="closeModal"
                    class="px-4 py-2 text-sm font-medium text-white bg-[#396895] rounded-lg hover:bg-[#396895] transition">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import store from "@/store";
export default {
    name: "ViewAreas",
    props: {
        areas: {
            type: Array,
            required: true,
        },
        isVisible: {
            type: Boolean,
            required: true,
        },
    },
    emits: ["close"],
    
    setup(props, { emit }) {
        const NameArea = store.getters.getItemName('Áreas');
        const closeModal = async () => {
            emit("close");
        }

        return {
            closeModal,
            NameArea
        }

    }

};
</script>

<style scoped>
/* Opcional: Puedes agregar transiciones adicionales aquí si es necesario */
</style>