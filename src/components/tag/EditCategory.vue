<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center  z-[9999]">
        <div class="bg-white rounded-lg shadow-lg w-96">
            <!-- Título del modal -->
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-bold text-gray-700">Actualización Masiva</h2>
            </div>

            <!-- Contenido del modal -->
            <div class="px-6 py-4">
              

                <!-- Selector de categoría de antenas -->
                <div class="mt-4">
                    <label for="antenna-select" class="block text-sm font-medium text-gray-500 mb-1">
                        Seleccionar categoría de {{nameTag}}
                    </label>
                    <select 
                        id="antenna-select" 
                        v-model="form.typeId"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-#497fae-500 focus:border-#497fae-500 block w-full p-2.5"
                    >
                       
                        <option 
                            v-for="cantenna in cantennas" 
                            :key="cantenna._id" 
                            :value="cantenna._id"
                        >
                            {{ cantenna.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-end px-6 py-4 border-t border-gray-200">
                <button 
                    class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300"
                    @click="close"
                >
                    Cerrar
                </button>
                <button 
                    class="bg-[#396895] text-white px-4 py-2 rounded-lg hover:bg-[#6999c2]"
                    :disabled="!form.typeId || ids.length === 0"
                    @click="confirmUpdate"
                >
                    Confirmar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { listCTagApi } from "@/api/CTagService";
import store from "@/store";

export default {
    name: "MassiveUpdateModal",
    props: {
        ids: {
            type: Array,
            required: true,
        },
    },
    emits: ["close", "confirmUpdate"],
    setup(props, { emit }) {
        const nameTag = store.getters.getItemName('Items Moviles')
        const form = ref({
            typeId: "", // ID de la antena seleccionada
        });
        const cantennas = ref([]); // Lista de categorías de antenas

        // Función para listar categorías de antenas
        const listCAntenna = async () => {
            try {
                const token = store.state.token;
                const response = await listCTagApi(token);
                if (response) {
                    cantennas.value = response.data.data;
                }
            } catch (error) {
                console.error("Error al listar categoría de antenas:", error);
            }
        };

        // Función para cerrar el modal
        const close = () => {
            emit("close");
        };

        // Función para confirmar la actualización masiva
        const confirmUpdate = () => {
            if (!form.value.typeId) {
                console.error("Debe seleccionar una categoría de antena.");
                return;
            }

            const payload = {
                ids: props.ids, // IDs recibidos como props
                typeId: form.value.typeId, // ID de la antena seleccionada
            };

            console.log("Actualización confirmada con:", payload);
            emit("confirmUpdate", payload);
            close();
        };

        // Llamar a la función para listar categorías al montar el componente
        onMounted(() => {
            listCAntenna();
        });

        return {
            form,
            cantennas,
            close,
            confirmUpdate,
            nameTag
        };
    },
};
</script>

<style scoped>
/* Estilos adicionales opcionales */
</style>
