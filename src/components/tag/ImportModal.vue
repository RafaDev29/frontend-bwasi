<template>
    <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-[99990]">
        <div class="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 class="text-lg font-semibold text-gray-700 mb-4">Importar Excel</h2>
            <p class="text-gray-600 mb-6">Selecciona un archivo Excel para cargar los datos.</p>
            <input
                type="file"
                accept=".xls,.xlsx"
                @change="handleFileUpload"
                class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-#497fae-400 focus:border-#497fae-400"
            />
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                    type="color"
                    v-model="color"
                    class="w-full border-4 border-gray-300 rounded-lg  py-10 text-lg focus:outline-none"
                />
            </div>
            <div class="mb-4 mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Seleccionar un ícono</label>
                <div
                    class="border border-gray-300 rounded-lg px-3 py-2 transition-all duration-300"
                    :class="{ 'h-auto py-4': isDropdownOpen, 'h-12': !isDropdownOpen }"
                    @click="toggleDropdown"
                >
                    <!-- Mostrar el ícono seleccionado -->
                    <div v-if="!isDropdownOpen" class="flex items-center">
                        <i :class="icon" class="text-2xl ml-2"></i>
                    </div>
                    <!-- Mostrar íconos cuando el campo está expandido -->
                    <div v-if="isDropdownOpen" class="grid grid-cols-6 gap-2 mt-2">
                        <div
                            v-for="iconItem in icons"
                            :key="iconItem"
                            class="cursor-pointer hover:bg-gray-100 flex justify-center items-center rounded-lg p-2"
                            :class="{ 'bg-#497fae-100 text-#497fae-500': icon === iconItem }"
                            @click.stop="selectIcon(iconItem)"
                        >
                            <i :class="iconItem" class="text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
                <button
                    @click="emitClose"
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                    Cancelar
                </button>
                <button
                    :disabled="!file"
                    @click="processAndEmitData"
                    class="px-4 py-2 bg-[#396895] text-white rounded hover:bg-[#396895] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Importar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import * as XLSX from "xlsx"; // Importamos la librería para manejar Excel
import { ref } from "vue";

export default {
    name: "ImportModal",
    props: {
        tagId: {
            type: String,
            required: true,
        },
    },
    emits: ["close", "confirmImport"],
    setup(props, { emit }) {
        const file = ref(null);
        const color = ref("#9C27B0");
        const icon = ref("fa-solid fa-user");
        const isDropdownOpen = ref(false);
        const extractedData = ref([]);
        const icons = ref([
            "fa-solid fa-user",
            "fa-solid fa-star",
            "fa-solid fa-heart",
            "fa-solid fa-car",
            "fa-solid fa-home",
            "fa-solid fa-bell",
        ]);

        const handleFileUpload = (event) => {
            const uploadedFile = event.target.files[0];
            if (uploadedFile) {
                file.value = uploadedFile;
            }
        };

        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        const selectIcon = (selectedIcon) => {
            icon.value = selectedIcon;
            isDropdownOpen.value = false;
        };

        const processAndEmitData = () => {
            if (!file.value) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });
                const firstSheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[firstSheetName];
                const rows = XLSX.utils.sheet_to_json(sheet);

                // Construir el JSON para cada fila
                extractedData.value = rows.map((row) => ({
                    mac: row.map(item => item.mac),

                    name: row.name,
                    proxyName: row.proxyName,
                    proxyPhone: row.proxyPhone,
                    proxyEmail: row.proxyEmail,
                    identifier: row.identifier,
                    color: color.value,
                    icon: icon.value,
                    typeId: props.tagId,
                }));

            
                console.log("Datos a emitir:", extractedData.value); // Mostrar en consola
                emit("confirmImport", extractedData.value);
            };
            reader.readAsBinaryString(file.value);
        };

        const emitClose = () => {
            emit("close");
        };

        return {
            file,
            color,
            icon,
            icons,
            isDropdownOpen,
            handleFileUpload,
            toggleDropdown,
            selectIcon,
            processAndEmitData,
            emitClose,
        };
    },
};
</script>
