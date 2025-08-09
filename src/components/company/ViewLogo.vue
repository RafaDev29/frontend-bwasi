<template>
    <!-- Modal -->
    <div v-if="internalVisible" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-96">
            <!-- Header -->
            <div class="border-b px-4 py-2 text-lg font-semibold">
                Logo
            </div>
            <!-- Body -->
            <div class="p-4 flex justify-center">
                <div v-if="logo">
                    <img :src="logo" alt="Logo" class="w-full h-auto rounded" />
                </div>
                <div v-else>
                    <p class="text-gray-600">No hay logo</p>
                </div>
            </div>
            <!-- Footer -->
            <div class="flex justify-end border-t px-4 py-2">
                <button @click="closeModal"
                    class="bg-[#396895] text-white px-4 py-2 rounded hover:bg-[#396895] transition">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, computed } from "vue";

export default {
    name: "LogoModal",
    props: {
        logoUrl: {
            type: String,
            default: null,
        },
        isVisible: {
            type: Boolean,
            required: true,
        },
    },
    emits: ["update:isVisible"],
    setup(props, { emit }) {
        const logo = ref(null); // Almacena la URL del logo (directamente del prop)
        const internalVisible = computed({
            get: () => props.isVisible,
            set: (value) => emit("update:isVisible", value),
        });

        // Observar cambios en `logoUrl` para actualizar el logo directamente
        watch(
            () => props.logoUrl,
            (newUrl) => {
                logo.value = newUrl || null;
            },
            { immediate: true }
        );

        // Cerrar el modal
        const closeModal = () => {
            internalVisible.value = false;
        };

        return {
            logo,
            internalVisible,
            closeModal,
        };
    },
};
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si los necesitas */
</style>