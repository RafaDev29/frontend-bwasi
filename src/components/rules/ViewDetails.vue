<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-40 z-[9999]"
        @click.self="closeModal">
        <div class="overflow-hidden bg-white rounded-xl shadow-2xl max-w-md w-ful max-h-[95vh] overflow-y-auto"
            style="max-height: 80vh;">
            <!-- Encabezado -->
            <div
                class="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-#497fae-500 to-#497fae-700 text-white">
                <h1 class="text-lg font-semibold flex items-center">
                    <i class="mdi mdi-database text-2xl mr-2"></i>
                    Detalles de Antena
                </h1>
                <button @click="closeModal" class="text-white hover:text-gray-200 transition">
                    <i class="mdi mdi-close text-2xl"></i>
                </button>
            </div>

            <!-- Contenido -->
            <div class="p-6">
                <table class="w-full border-collapse">
                    <tbody>
                        <tr v-for="(value, key) in antennaDetails" :key="key" class="border-b">
                            <td class="py-2 px-4 font-medium text-gray-700 capitalize">{{ key }}</td>
                            <td class="py-2 px-4 text-gray-600">{{ value }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pie de página -->
            <div class="flex justify-end px-6 py-4 bg-gray-100">
                <button @click="closeModal"
                    class="px-5 py-2 text-sm font-medium text-white bg-[#396895] rounded-lg hover:bg-[#396895] transition">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
export default {
    name: "ViewDetails",
    props: {
        isVisible: {
            type: Boolean,
            required: true,
        },
        antennas: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    },
    emits: ["close"],
    setup(props, { emit }) {
        const closeModal = () => {
            emit("close");
        };

        let contacto = props.antennas?.typeContact.email.range  || "N/A";
         if (contacto[0] === "PERSONALIZED" && contacto[1]==="PROXY" ) {
             contacto = "PERSONALIZADO Y APODERADOS";
         } else if (contacto[0] === "PROXY" && contacto[1]==="PERSONALIZED") {
            contacto = "PERSONALIZADO Y APODERADO";
        } else if (contacto[0] === "PROXY") {
            contacto = "APODERADO";
        }else if (contacto[0] === "PERSONALIZED") {
            contacto = "PERSONALIZADO";
        }else if (contacto.length==0) {
            contacto = "Sin contactos";
        }
 
        const antennaDetails = computed(() => {
            return {
                Nombre: props.antennas?.name || "N/A",
                Tipo: props.antennas?.type || "N/A",
                "Límite de Tiempo": props.antennas?.timeLimit || "N/A",
                Notificaciones: props.antennas?.typeNotification?.join(", ") || "N/A",
                Emails: props.antennas?.emails?.join(", ") || "N/A",
                Números: props.antennas?.numbers?.join(", ") || "N/A",
                Contacto: contacto
            };
        });

        return {
            closeModal,
            antennaDetails,
        };
    },
};
</script>

<style scoped>
/* Agregar estilos adicionales si se necesita */
</style>
