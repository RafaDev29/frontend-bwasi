<template>
    <div v-if="item" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-8 max-h-[95vh] overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Crear Grupo de áreas</h2>
            <form @submit.prevent="submitForm">
                <!-- Campo Nombre -->
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Grupo</label>
                    <input 
                        type="text" 
                        v-model="form.name" 
                        class="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500 placeholder-gray-400"
                        placeholder="Ingrese el nombre del grupo"
                        required
                    />
                </div>

                <!-- Listas de Drag and Drop -->
                <div class="flex gap-8">
                    <!-- Etiquetas Disponibles -->
                    <div class="w-1/2 bg-gray-50 border border-gray-300 rounded-lg shadow p-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-medium text-gray-800">Etiquetas Disponibles</h3>
                            <button 
                                type="button" 
                                @click="selectAll('available')"
                                class="text-#497fae-600 hover:underline font-medium"
                            >
                                Seleccionar Todos
                            </button>
                        </div>
                        <div 
                            class="border border-gray-200 rounded-lg p-4 min-h-[300px] bg-white overflow-y-auto"
                            @dragover.prevent
                            @drop="dropItem('available')"
                        >
                            <div 
                                v-for="tag in availableTags" 
                                :key="tag._id" 
                                class="bg-#497fae-50 border border-#497fae-200 rounded-lg p-2 mb-2 shadow-md cursor-pointer hover:bg-#497fae-100 transition"
                                draggable="true"
                                @dragstart="dragStart(tag)"
                                @click="toggleSelection(tag, 'available')"
                            >
                                {{ tag.name }}
                            </div>
                        </div>
                    </div>

                    <!-- Etiquetas Seleccionadas -->
                    <div class="w-1/2 bg-gray-50 border border-gray-300 rounded-lg shadow p-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-medium text-gray-800">Etiquetas Seleccionadas</h3>
                            <button 
                                type="button" 
                                @click="selectAll('selected')"
                                class="text-red-600 hover:underline font-medium"
                            >
                                Quitar Todos
                            </button>
                        </div>
                        <div 
                            class="border border-gray-200 rounded-lg p-4 min-h-[300px] bg-white overflow-y-auto"
                            @dragover.prevent
                            @drop="dropItem('selected')"
                        >
                            <div 
                                v-for="tag in selectedTags" 
                                :key="tag._id" 
                                class="bg-red-50 border border-red-200 rounded-lg p-2 mb-2 shadow-md cursor-pointer hover:bg-red-100 transition"
                                draggable="true"
                                @dragstart="dragStart(tag)"
                                @click="toggleSelection(tag, 'selected')"
                            >
                                {{ tag.name }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botones de Acción -->
                <div class="flex justify-end mt-8 space-x-4">
                    <button 
                        type="button" 
                        @click="closeDialog" 
                        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        class="px-6 py-2 bg-[#396895] text-white rounded-lg font-medium hover:bg-[#6999c2] transition"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { listAreasApi } from '@/api/AreaService';
import store from '@/store';

export default {
    emits: ['close', 'ItemCreate'],
    setup(props, { emit }) {
        const item = ref(true);
        const form = ref({
            name: '',
        });

        // Etiquetas disponibles y seleccionadas
        const availableTags = ref([]);
        const selectedTags = ref([]);
        let draggedItem = null; // Etiqueta arrastrada

        // Listar etiquetas
        const listTags = async () => {
            const token = store.state.token;
            const response = await listAreasApi(token);
            availableTags.value = response.data.data;
        };

        // Manejo de Drag and Drop
        const dragStart = (tag) => {
            draggedItem = { ...tag }; // Copiar la referencia para evitar problemas
        };

        const dropItem = (targetList) => {
            if (!draggedItem) return;

            moveTag(draggedItem, targetList);
            draggedItem = null;
        };

        // Mover una etiqueta entre listas
        const moveTag = (tag, targetList) => {
            if (targetList === 'available') {
                selectedTags.value = selectedTags.value.filter(t => t._id !== tag._id);
                availableTags.value = [...availableTags.value, tag];
            } else if (targetList === 'selected') {
                availableTags.value = availableTags.value.filter(t => t._id !== tag._id);
                selectedTags.value = [...selectedTags.value, tag];
            }
        };

        // Alternar selección con clic
        const toggleSelection = (tag, currentList) => {
            const targetList = currentList === 'available' ? 'selected' : 'available';
            moveTag(tag, targetList);
        };

        // Seleccionar todos o quitar todos
        const selectAll = (targetList) => {
            if (targetList === 'available') {
                selectedTags.value.push(...availableTags.value);
                availableTags.value = [];
            } else if (targetList === 'selected') {
                availableTags.value.push(...selectedTags.value);
                selectedTags.value = [];
            }
        };

        // Cerrar diálogo
        const closeDialog = () => {
            emit('close');
        };

        // Enviar datos
        const submitForm = async () => {
            const payload = {
                name: form.value.name,
                areas: selectedTags.value.map(tag => tag._id), // Solo los IDs seleccionados
            };
        
            emit('ItemCreate', payload);
        };

        // Inicializar etiquetas
        onMounted(listTags);

        return {
            item,
            form,
            availableTags,
            selectedTags,
            dragStart,
            dropItem,
            toggleSelection,
            selectAll,
            closeDialog,
            submitForm,
        };
    },
};
</script>

<style scoped>

</style>
