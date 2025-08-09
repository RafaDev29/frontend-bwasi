<template>
    <div v-if="editedItem" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
        <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-8 max-h-[95vh] overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Editar grupo de áreas</h2>
            <form @submit.prevent="submitUpdate">
                <!-- Campo Nombre -->
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Área</label>
                    <input 
                        type="text" 
                        v-model="editedItem.name" 
                        class="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:ring-2 focus:ring-#497fae-500 focus:border-#497fae-500 placeholder-gray-400"
                        placeholder="Ingrese el nombre del área"
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
                        @click="$emit('close')" 
                        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        class="px-6 py-2 bg-[#396895] text-white rounded-lg font-medium hover:bg-[#6999c2] transition"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { listAreasApi } from "@/api/AreaService";
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
        const editedItem = ref({ ...props.item });
        const availableTags = ref([]); // Etiquetas disponibles
        const selectedTags = ref([...props.item.areas]); // Inicializar con las etiquetas seleccionadas
        let draggedItem = null; // Etiqueta arrastrada

        // Sincronizar cambios cuando cambien las props
        watch(
            () => props.item,
            (newItem) => {
                editedItem.value = { ...newItem };
                selectedTags.value = [...newItem.areas];
            }
        );

        // Listar etiquetas disponibles
        const listLayout = async () => {
            try {
                const token = store.state.token;
                const response = await listAreasApi(token);
                // Filtrar etiquetas que ya están seleccionadas
                availableTags.value = response.data.data.filter(
                    (tag) => !selectedTags.value.some((selected) => selected._id === tag._id)
                );
            } catch (error) {
                console.error("Error al obtener etiquetas:", error);
            }
        };

        // Manejo de Drag and Drop
        const dragStart = (tag) => {
            draggedItem = { ...tag }; // Clonar el objeto
        };

        const dropItem = (targetList) => {
            if (!draggedItem) return;
            moveTag(draggedItem, targetList);
            draggedItem = null; // Limpiar después del drop
        };

        // Mover etiquetas entre listas
        const moveTag = (tag, targetList) => {
            if (targetList === "available") {
                selectedTags.value = selectedTags.value.filter((t) => t._id !== tag._id);
                availableTags.value = [...availableTags.value, tag];
            } else if (targetList === "selected") {
                availableTags.value = availableTags.value.filter((t) => t._id !== tag._id);
                selectedTags.value = [...selectedTags.value, tag];
            }
        };

        // Alternar selección con clic
        const toggleSelection = (tag, currentList) => {
            const targetList = currentList === "available" ? "selected" : "available";
            moveTag(tag, targetList);
        };

        // Seleccionar todos o quitar todos
        const selectAll = (targetList) => {
            if (targetList === "available") {
                selectedTags.value.push(...availableTags.value);
                availableTags.value = [];
            } else if (targetList === "selected") {
                availableTags.value.push(...selectedTags.value);
                selectedTags.value = [];
            }
        };

        // Enviar datos al guardar
        const submitUpdate = () => {
            const payload = {
                ...editedItem.value,
                areas: selectedTags.value,
            };
            emit("updateItem", payload);
        };

        // Cargar etiquetas disponibles al montar
        onMounted(listLayout);

        return {
            editedItem,
            availableTags,
            selectedTags,
            dragStart,
            dropItem,
            toggleSelection,
            selectAll,
            submitUpdate,
        };
    },
};
</script>

<style scoped>

</style>
