<template>
    <div class="flex items-center space-x-4 mb-5">
        <v-text-field 
            v-model="search" 
            label="Buscar" 
            prepend-inner-icon="mdi-magnify" 
            variant="outlined" 
            hide-details
            class="flex-grow"
            density="compact" 
        ></v-text-field>

        <v-menu>
            <template v-slot:activator="{ props }">
                <button 
                    v-bind="props"
                    class="flex items-center justify-center bg-[#497fae] text-white font-bold px-4 py-1 rounded-lg hover:bg-[#6999c2] shadow-md  text-xl mdi mdi-format-list-bulleted"
                >
                    <span>
                        {{ selectedEvent?.title || '' }}
                    </span>
                    <!-- <v-icon class="">mdi-menu-down</v-icon> -->
                </button>
            </template>

            <v-list>
                <v-list-item 
                    v-for="event in events" 
                    :key="event.value"
                    @click="handleEventSelection(event)"
                    class="hover:bg-gray-100 cursor-pointer"
                >
                    <v-list-item-title 
                        class="flex items-center"
                        :class="{
                            'text-red-600': event.value === 'Eliminación Masiva',
                            'text-#497fae-600': event.value === 'Actualización Masiva',
                            'text-#099cb4-600': event.value === 'Importar Excel',
                        }"
                    >
                        <v-icon 
                            :class="{
                                'text-red-600': event.value === 'Eliminación Masiva',
                                'text-#497fae-600': event.value === 'Actualización Masiva',
                                'text-#099cb4-600': event.value === 'Importar Excel',
                            }"
                            class="mr-2"
                        >
                            {{ event.icon }}
                        </v-icon>
                        {{ event.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>

    <v-card flat>
        <v-data-table 
            :headers="headers" 
            :items="indexedItems" 
            :search="search" 
            show-select 
            v-model="selectedItems"
            item-value="_id"
            density="compact"  class="ma-2" 
        >
            <template v-slot:[`item.actions`]="{ item }">
                <div class="flex space-x-2">
                    <v-icon 
                        small 
                        color="#099cb4" 
                        class="hover:bg-#099cb4-100 rounded-full p-1 transition-colors" 
                        @click="editItem(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon 
                        small 
                        color="red" 
                        class="hover:bg-red-100 rounded-full p-1 transition-colors" 
                        @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                </div>
            </template>

            <template v-slot:[`item.icon`]="{ item }">
                <v-icon :class="item.icon" class="mdi-account"></v-icon>
            </template>

            <template v-slot:[`item.color`]="{ item }">
                <div 
                    :style="{ 
                        backgroundColor: item.color, 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%' 
                    }"
                ></div>
            </template>
        </v-data-table>
</v-card>
</template>

<script>
import { ref, computed } from "vue";
import Swal from "sweetalert2";

export default {
    name: "DataTable",
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
    emits: ["deleteItem", "editItem", "deleteMassive", "updateMassive", "importExcel"],
    setup(props, { emit }) {
        const search = ref("");
        const selectedItems = ref([]);
        const selectedEvent = ref(null);

        const events = ref([
            { 
                title: "Eliminación Masiva", 
                value: "Eliminación Masiva",
                icon: "mdi-delete"
            },
            { 
                title: "Actualización Masiva", 
                value: "Actualización Masiva",
                icon: "mdi-pencil"
            },
            { 
                title: "Importar Excel", 
                value: "Importar Excel",
                icon: "mdi-file-excel"
            }
        ]);

        const headers = ref([
            { key: "id", title: "ID" },
            { key : "identifier", title: "Indetificador"},
            { key: "name", title: "Nombre" },
            { key: "mac", title: "MAC" },
       
            { key: "actions", title: "Acciones", sortable: false },
        ]);

        const indexedItems = computed(() => {
            return props.items.map((item, index) => ({
                id: index + 1,
                ...item,
            }));
        });

        const handleEventSelection = (event) => {
            if (event.value === "Importar Excel") {
                emit("importExcel");
                return;
            }

            if (selectedItems.value.length === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "No se seleccionaron filas",
                    text: "Por favor selecciona al menos una fila antes de realizar esta acción.",
                });
                return;
            }

            if (event.value === "Eliminación Masiva") {
                emit("deleteMassive", selectedItems.value);
            } else if (event.value === "Actualización Masiva") {
                emit("updateMassive", selectedItems.value);
            }

            // Resetear selección
            selectedEvent.value = null;
            selectedItems.value = [];
        };

        const deleteItem = (item) => {
            emit("deleteItem", item);
        };

        const editItem = (item) => {
            emit("editItem", item);
        };

        return {
            search,
            selectedItems,
            selectedEvent,
            events,
            headers,
            indexedItems,
            handleEventSelection,
            deleteItem,
            editItem,
        };
    },
};
</script>
