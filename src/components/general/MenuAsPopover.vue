<template>
    <div class="text-center">
        <v-menu v-model="menu" :close-on-content-click="false" location="end" @click:outside="rotateIcon">
            <template v-slot:activator="{ props }">
                <v-btn icon="mdi-chevron-down" size="small" variant="text" v-bind="props"
                    :class="{ 'rotated': isRotated }" @click="rotateIcon"></v-btn>
            </template>

            <v-card min-width="200">
                <v-divider></v-divider>
                <v-list>
                    <v-list-item class="px-5">
                        <div class="cursor-pointer transition hover:text-#497fae-300
                ease-in duration-100 flex gap-2 rounded-lg items-center text-gray-400 text-sm">
                            <i class="fa-solid fa-user"></i>
                            <span>Perfil</span>
                        </div>
                    </v-list-item>
                    <v-list-item class="px-5" @click="openConfig">
                        <div class="cursor-pointer transition hover:text-#497fae-300
                ease-in duration-100 flex gap-2 rounded-lg items-center text-gray-400 text-sm">
                            <i class="fa-solid fa-gear"></i>
                            <span>Configuración</span>
                        </div>
                    </v-list-item>
                </v-list>
                <v-list>
                    <v-list-item class="px-3">
                        <div class="py-2 px-5 bg-[#099cb4] hover:bg-[#6999c2] cursor-pointer transition 
                ease-in duration-100 flex justify-between rounded-lg items-center text-white text-sm" @click="logout">
                            <span>Cerrar sesión</span>
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </div>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>


        <MenuConfiguracion :is-visible="isConfigDialogVisible" @close="isConfigDialogVisible = false"
            @config-updated="refreshMenuData" />

    </div>
</template>

<script>
import { ref } from "vue";
import MenuConfiguracion from "./MenuConfiguracion.vue";
import store from "@/store";
export default {
    components: {
        MenuConfiguracion,
    },
    setup() {
        const isRotated = ref(false);
        const menu = ref(false);
        const isConfigDialogVisible = ref(false); // Controla la visibilidad del diálogo de configuración

        const rotateIcon = () => {
            isRotated.value = !isRotated.value;
        };

        const openConfig = () => {
            isConfigDialogVisible.value = true; // Abre el cuadro de diálogo
        };

        const logout = () => {
            localStorage.clear();
            location.reload();
        };

        const refreshMenuData = () => {

            store.dispatch('initializeMenuDataFromLocalStorage');
            console.log('Menú actualizado desde localStorage.');
        };


        return {
            menu,
            isRotated,
            isConfigDialogVisible,
            rotateIcon,
            openConfig,
            logout,
            refreshMenuData
        };
    },


};
</script>

<style scoped>
i {
    transition: transform 0.3s ease;
}

.rotated {
    transform: rotate(180deg);
}

.v-list-item__content.v-list-item-title {
    font-size: 0.8rem !important;
}

.v-list-item__content.v-list-item-subtitle {
    font-size: 0.8rem !important;
}
</style>