<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="text-lg font-semibold text-gray-700 mb-4 text-center">Editar categoría</h2>
            <form @submit.prevent="submitUpdate">
                <!-- Nombre -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <input type="text" v-model="editedItem.name"
                        class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500"
                        required />
                </div>

                <!-- Ícono -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Seleccionar un ícono</label>
                    <div class="border border-gray-300 rounded-lg px-3 py-2 transition-all duration-300"
                        :class="{ 'h-auto py-4': isDropdownOpen, 'h-12': !isDropdownOpen }" @click="toggleDropdown">
                        <!-- Mostrar el ícono seleccionado -->
                        <div v-if="!isDropdownOpen" class="flex items-center">
                            <i :class="editedItem.icon" class="text-2xl ml-2"></i>
                        </div>

                        <!-- Mostrar íconos cuando el campo está expandido -->
                        <div v-if="isDropdownOpen" class="grid grid-cols-6 gap-2 mt-2">
                            <div v-for="icon in icons" :key="icon"
                                class="cursor-pointer hover:bg-gray-100 flex justify-center items-center rounded-lg p-2"
                                :class="{ 'bg-#497fae-100 text-#497fae-500': editedItem.icon === icon }"
                                @click.stop="selectIcon(icon)">
                                <i :class="icon" class="text-2xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Color -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">Color</label>
                    <input type="color" v-model="editedItem.color"
                        class="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-#497fae-500" />
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
import { ref, watch } from 'vue';

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    emits: ['close', 'updateItem'],
    setup(props, { emit }) {
        const editedItem = ref({ ...props.item });
        const icons = [
    'fa-solid fa-user',
    'fa-solid fa-book',
    'fa-solid fa-car',
    'fa-solid fa-camera',
    'fa-solid fa-music',
    'fa-solid fa-microscope',
    'fa-solid fa-flask',       
    'fa-solid fa-vial',        
    'fa-solid fa-vials',       
    'fa-solid fa-atom',        
    'fa-solid fa-scale-balanced', 
    'fa-solid fa-glasses',     
    'fa-solid fa-prescription-bottle', 
    'fa-solid fa-eye-dropper', 
    'fa-solid fa-virus',       
    'fa-solid fa-dna',         
    'fa-solid fa-radiation',   
    'fa-solid fa-syringe',     
    'fa-solid fa-pills',       
    'fa-solid fa-wind'         
];


        const isDropdownOpen = ref(false);

        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        const selectIcon = (icon) => {
            editedItem.value.icon = icon;
            isDropdownOpen.value = false;
        };

        watch(
            () => props.item,
            (newItem) => {
                editedItem.value = { ...newItem };
            }
        );

        const submitUpdate = () => {
            emit('updateItem', editedItem.value);
        };

        return {
            editedItem,
            icons,
            isDropdownOpen,
            toggleDropdown,
            selectIcon,
            submitUpdate,
        };
    },
};
</script>

<style scoped>
.bg-#497fae-100 {
    background-color: #cfe2f3 !important;
}

.text-#497fae-500 {
    color: #497fae !important;
}
</style>
