<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer v-if="!isCamposGeneralesView" v-model="drawer" :rail="rail" permanent
                @click="rail = false" color="#28415c" class="border-0 ">
                <div class="p-2 py-7 flex items-center justify-center gap-2">
                    <div>
                        <div class="p-1 pt-4 flex items-center justify-center">
                            <img :src="logo" class="w-[6rem] bg-primary-100 rounded-md" />
                        </div>
                        <!-- <p v-if="!rail" class="font-bold text-2xl text-center w-full">eBeacons</p> -->
                    </div>
                </div>
                <v-list>
                    <div v-for="itemNavegation in filteredItems" :key="itemNavegation.value">
                        <!-- Si no tiene hijos, renderizar como router-link -->
                        <template v-if="itemNavegation.children.length === 0">
                            <router-link :to="itemNavegation.to">
                                <v-list-item @click="selectItem(itemNavegation.to)" :prepend-icon="itemNavegation.icon"
                                    :title="itemNavegation.title" :value="itemNavegation.value"
                                    :class="{ 'selected-item-orange': selectedItem === itemNavegation.to }"></v-list-item>
                                <v-tooltip activator="parent" location="end" v-if="rail">
                                    {{ itemNavegation.title }}
                                </v-tooltip>
                            </router-link>
                        </template>
                        <!-- Si tiene hijos, renderizar como v-list-group -->
                        <template v-else>
                            <v-list-group v-model="itemNavegation.open" fluid>
                                <template v-slot:activator="{ props }">
                                    <v-list-item v-bind="props" :prepend-icon="itemNavegation.icon"
                                        :title="itemNavegation.title" color="#dad9dc"></v-list-item>
                                </template>
                                <!-- Submenús recursivos -->
                                <div v-for="child in itemNavegation.children" :key="child.value">
                                    <!-- Submenú del submenú -->
                                    <template v-if="child.children.length > 0">
                                        <v-list-group v-model="child.open" fluid>
                                            <template v-slot:activator="{ props }">
                                                <v-list-item v-bind="props" :prepend-icon="child.icon"
                                                    :title="child.title"></v-list-item>
                                            </template>
                                            <router-link v-for="subChild in child.children" :key="subChild.value"
                                                :to="subChild.to">
                                                <v-list-item @click="selectItem(subChild.to)"
                                                    :prepend-icon="subChild.icon" :title="subChild.title"
                                                    :value="subChild.value"
                                                    :class="{ 'selected-item-orange': selectedItem === subChild.to }">
                                                </v-list-item>
                                            </router-link>
                                        </v-list-group>
                                    </template>
                                    <!-- Renderizar nivel 2 directamente si no hay más hijos -->
                                    <template v-else>
                                        <router-link :to="child.to">
                                            <v-list-item @click="selectItem(child.to)" :prepend-icon="child.icon"
                                                :title="child.title" :value="child.value"
                                                :class="{ 'selected-item-orange': selectedItem === child.to }"></v-list-item>
                                        </router-link>
                                    </template>
                                </div>
                            </v-list-group>
                        </template>
                    </div>
                </v-list>
            </v-navigation-drawer>
            <v-main class="h-screen layout-wider bg-slate-100 block">
                <div class="w-full bg-white flex justify-between items-center px-3 shadow-sm">
                    <v-btn variant="text" icon="mdi-menu" color="#2b4968" class="cursor-pointer"
                        @click.stop="rail = !rail"></v-btn>
                    <div class="flex items-center">

                        <BellAlert />
                        <div class="flex items-center text-start text-xs">
                            <v-list>
                                <v-list-item class="text-start item-personalizado" :prepend-avatar="avatarPath">
                                    <template v-slot:default>
                                        <v-row>
                                            <v-col>
                                                <div class="text-sm">Hola, {{ nombre_usuario }}</div>
                                                <div class="caption">{{ rols }}</div>
                                            </v-col>
                                        </v-row>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </div>

                        <MenuAsPopover />
                    </div>
                </div>
                <section class="overflow-y-auto overflow-x-auto section_main custom-scrollbar"
                    :class="isMobile ? 'p-4' : 'pt-3 pl-6 pr-4'">
                    <router-view />
                </section>
            </v-main>
        </v-layout>
    </v-card>

    <notification-alert ref="notificationAlert" />


</template>

<script>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import MenuAsPopover from '@/components/general/MenuAsPopover.vue';
import store from '@/store';
import { listCAntennaApi } from '@/api/CAntennaService';
import { listCTagApi } from '@/api/CTagService';
import { connectNotificationSocket, disconnectNotificationSocket } from "@/api/NotificationService";
import NotificationAlert from "@/layouts/NotificationAlert.vue";
import BellAlert from "@/components/general/BellAlert.vue"
export default {
    components: {
        MenuAsPopover,
        NotificationAlert,
        BellAlert
    },
    setup() {
        const isMobile = ref(false);
        const drawer = ref(true);
        const rail = ref(true);
        const nombre_usuario = ref('');
        const selectedItem = ref(null);
        const dialogLoader = ref(false);
        const logo = store.state.logoName
        const notificationAlert = ref(null);

        const handleNotificationUpdate = (data) => {
            if (data && data.description) {
                // Mostrar la notificación
                notificationAlert.value.showNotification(
                    `(${data.identifier}) ${data.name}`,
                    `${data.namerule}`,
                    `${data.area} - ${data.description}`,
                    "mdi-bell",
                    10000
                );

                // Crear el objeto de notificación
                const notificationData = {
                    identifier: data.identifier,
                    name: data.name,
                    namerule: data.namerule,
                    area: data.area,
                    description: data.description,
                    timestamp: new Date().toISOString(),
                };

                // Guardar la notificación en el store
                store.dispatch("addNotification", notificationData);
            }
        };

        const handleGatewayUpdate = (data) => {
            if (!data || !data.description || !data.gateway || !data.date) {
                console.error("Datos de notificación incompletos:", data);
                return;
            }

            // Formatear la notificación
            const notificationData = {
                identifier: data.gateway,  // Se usa como ID único
                name: "Gateway",  // Título genérico o dinámico
                namerule: "Estado",
                area: "",
                description: data.description,
                timestamp: new Date(data.date).toISOString(), // Convertir fecha a formato legible
                type: "GATEWAY", // Tipo de notificación (puede ser útil para filtrar)
            };

            // Mostrar la notificación en el componente NotificationAlert
            if (notificationAlert.value) {
                notificationAlert.value.showNotification(
                    `(${notificationData.identifier}) ${notificationData.name}`,
                    `${notificationData.namerule}`,
                    `${notificationData.area} - ${notificationData.description}`,
                    "mdi-gateway",  // Ícono para Gateways
                    10000 // Tiempo en milisegundos
                );
            } else {
                console.warn("notificationAlert no está inicializado aún.");
            }

            // Guardar la notificación en Vuex Store
            store.dispatch("addNotification", notificationData);
        };




        // Callback para manejar errores de conexión
        const handleError = (error) => {
            console.error("Error en la conexión de Socket.IO:", error);
        };


        const ItemsNavegation = ref([


            // MANTENIMIENTOS PARA USUARIO SUPER_MASTER
            {
                icon: "mdi-tools",
                title: "Mantenimiento",
                value: "maintenanceMaster",
                to: "/maintenanceMaster",
                children: [
                    {
                        icon: "mdi-office-building",
                        title: "Compañias",
                        value: "companies",
                        to: "/companies",
                        children: []
                    },
                ]
            },
            // MANTENIMIENTOS PARA USUARIO COMPANY_MASTER
            {
                icon: "mdi-wrench",
                title: "Mantenimiento",
                value: "maintenanceCompany",
                to: "/maintenanceCompany",
                children: [
                    {
                        icon: "mdi-account-multiple",
                        title: "Clientes",
                        value: "customers",
                        to: "/customers",
                        children: []
                    },
                ]
            },
            // MANTENIMIENTO PARA USUARIO CUSTOMER
            // {
            //     icon: "mdi-view-dashboard",
            //     title: "Tablero",
            //     value: "dashboard",
            //     to: "/dashboard",
            //     children: []
            // },
            {
                icon: "mdi-monitor",
                title: "Monitoreo",
                value: "monitoring",
                to: "/monitoring",
                children: []
            },
            {
                icon: "mdi-wrench",
                title: "Mantenimientos",
                value: "maintenance",
                to: "/maintenance",
                children: [
                    {
                        icon: "mdi-ruler-square-compass",
                        title: "Planos",
                        value: "planes",
                        to: "/planes",
                        children: []
                    },
                    {
                        icon: "mdi-view-grid",
                        title: store.getters.getItemName('Layouts'),
                        value: "layout",
                        to: "/layout",
                        children: []
                    },
                    {
                        icon: "mdi-map-marker",
                        title: store.getters.getItemName('Áreas'),
                        value: "area",
                        to: "/area",
                        children: []
                    },
                    {
                        icon: "mdi-access-point",
                        title: store.getters.getItemName('Puntos de área'),
                        value: "antennas",
                        to: "/antennas",
                        children: []
                    },
                    {
                        icon: "mdi-tag",
                        title: store.getters.getItemName('Items Moviles'),
                        value: "tags",
                        to: "/tags",
                        children: []
                    },
                    {
                        icon: "mdi-account",
                        title: "Operadores",
                        value: "operators",
                        to: "/operators",
                        children: []
                    },
                ]
            },
            {
                icon: "mdi-account-group",
                title: "Grupos",
                value: "groups",
                to: "/groups",
                children: [
                    {
                        icon: "mdi-tag-multiple",
                        title: store.getters.getItemName('Grupos etiquetas'),
                        value: "gptags",
                        to: "/gptags",
                        children: []
                    },
                    {
                        icon: "mdi-map-marker-multiple",
                        title: store.getters.getItemName('Grupos áreas'),
                        value: "gpareas",
                        to: "/gpareas",
                        children: []
                    },
                ]
            },
            {
                icon: "mdi-shape",
                title: "Categorías",
                value: "categories",
                to: "/categorias",
                children: [
                    {
                        icon: "mdi-tag-outline",
                        title: "Categorías de Etiquetas",
                        value: "catTags",
                        to: "/catTags",
                        children: []
                    },
                    {
                        icon: "mdi-access-point-network",
                        title: "Categorías de Antenas",
                        value: "catAntennas",
                        to: "/catAntennas",
                        children: []
                    },
                ]
            },

            {
                icon: "mdi mdi-bell-alert-outline",
                title: "Reglas de Notificaciones",
                value: "rules",
                to: "/rules",
                children: []
            },
            {
                icon: "mdi-file-chart",
                title: "Reportes",
                value: "reports",
                to: "/reports",
                children: []
            },

        ]);

        const loadDynamicTagSubmenus = async () => {
            try {
                dialogLoader.value = true;
                const token = store.state.token;
                const response = await listCTagApi(token);

                if (response.data && response.data.status) {

                    const dynamicSubmenus = response.data.data.map((tag) => ({
                        icon: "mdi-label-outline",
                        title: tag.name,
                        value: tag._id,
                        to: `/tags/${tag._id}`,
                    }));

                    const tagsMenu = ItemsNavegation.value
                        .find((item) => item.value === "maintenance")
                        ?.children.find((child) => child.value === "tags");

                    if (tagsMenu) {
                        tagsMenu.children = dynamicSubmenus;
                    }
                }
            } catch (error) {
                console.error("Error cargando submenús dinámicos para Tags:", error);
            } finally {
                dialogLoader.value = false; // Ocultar loader
            }
        };



        const loadDynamicAntennaSubmenus = async () => {
            try {
                dialogLoader.value = true;
                const token = store.state.token;
                const response = await listCAntennaApi(token);

                if (response.data && response.data.status) {

                    const dynamicSubmenus = response.data.data.map((category) => ({
                        icon: "mdi-folder-network-outline",
                        title: category.name,
                        value: category._id,
                        to: `/antennas/${category._id}`,
                    }));



                    const antennasMenu = ItemsNavegation.value
                        .find((item) => item.value === 'maintenance')
                        ?.children.find((child) => child.value === 'antennas');

                    if (antennasMenu) {
                        antennasMenu.children = dynamicSubmenus;
                    }
                }
            } catch (error) {
                console.error('Error cargando submenús dinámicos para Antenas:', error);
            } finally {
                dialogLoader.value = false; // Ocultar loader
            }
        };


        const router = useRoute();

        const loadData = async () => {
            dialogLoader.value = true;
            await store.dispatch('fetchMenuData');
            dialogLoader.value = false;
        };

        onMounted(async () => {
            nombre_usuario.value = store.state.username;
            handleResize();
            window.addEventListener("resize", handleResize);
            selectedItem.value = router.fullPath;

            if (Object.keys(store.state.menuData).length === 0) {
                await store.dispatch('fetchMenuData');
            }
        });


        const rols = computed(() => {
            if (store.state.role === 'CUSTOMER_MASTER') {
                return 'Cliente';
            } else if (store.state.role === 'COMPANY_MASTER') {
                return 'Compañia';
            } else if (store.state.role === 'SUPER_MASTER') {
                return 'Master'
            }
            return '';
        });

        const filteredItems = computed(() => {
            if (store.state.role === 'CUSTOMER_MASTER') {
                return ItemsNavegation.value.filter(item =>
                    item.value === 'dashboard' ||
                    item.value === 'monitoring' ||
                    item.value === 'maintenance' ||
                    item.value === 'groups' ||
                    item.value === 'categories' ||
                    item.value === 'reports' ||
                    item.value === 'rules'
                );

            } else if (store.state.role === 'COMPANY_MASTER') {
                return ItemsNavegation.value.filter(item => item.value === 'maintenanceCompany');
            } else if (store.state.role === 'SUPER_MASTER') {
                return ItemsNavegation.value.filter(item => item.value === 'maintenanceMaster')
            }
            else {
                return [];
            }
        });

        const handleResize = () => {
            isMobile.value = window.innerWidth <= 500;
        };

        const selectItem = (item) => {
            selectedItem.value = item;
        };


        onMounted(async () => {
            nombre_usuario.value = store.state.username;
            handleResize();
            window.addEventListener("resize", handleResize);
            selectedItem.value = router.fullPath;
            if (store.state.role === 'CUSTOMER_MASTER') {


                await loadDynamicAntennaSubmenus(); // Cargar submenús de Antennas
                await loadDynamicTagSubmenus(); // Cargar submenús de Tags
            }

        });


        const refreshMenuData = () => {
            store.dispatch('initializeMenuDataFromLocalStorage');
        };

        // Cargar datos al montar el componente
        onMounted(() => {
            handleResize();
            window.addEventListener("resize", handleResize);
            selectedItem.value = useRoute().fullPath;

            // Asegurar que los datos del menú estén inicializados
            store.dispatch('initializeMenuDataFromLocalStorage');
        });


        onMounted(() => {
            const customerid = store.state.customerid;
            if (customerid) {
                connectNotificationSocket(handleNotificationUpdate, handleGatewayUpdate, handleError, customerid);
            } else {
                console.error("No se encontró customerid en el estado del store.");
            }
        });

        onBeforeUnmount(() => {
            disconnectNotificationSocket(); // Desconectar el socket al salir
        });
        

        return {
            isMobile,
            drawer,
            rail,
            nombre_usuario,
            selectedItem,
            ItemsNavegation,
            filteredItems,
            selectItem,
            loadData,
            dialogLoader,
            rols,
            notificationAlert,
            refreshMenuData,
            logo,
            handleGatewayUpdate
        };
    }
};
</script>

<style>
.selected-item-orange {
    background-color: #2c4c6c !important;

    color: white !important;

    border-right: 3px solid #2b4968;

}

.v-list-item-title {
    font-size: 12px !important;
}

.v-list-item-subtitle {
    font-size: 13px !important;
}

.section_main {
    overflow-y: auto !important;
    height: 100%;
    padding-bottom: 2rem !important;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #aec9ef #f4f4f4;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #419bdb;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background-color: #f4f4f4;
    border-radius: 4px;
}

.v-list-group__items {
    border-left: 3px solid #396895;
    background-color: #2c4c6c;
    margin-left: 1px;
    padding-left: 0px;
}

.v-navigation-drawer>.v-navigation-drawer__content::-webkit-scrollbar {
    width: 6px;
    /* Ancho del scroll */
    padding-left: 10px;
}

.v-navigation-drawer>.v-navigation-drawer__content::-webkit-scrollbar-thumb {
    background-color: #abc9ee;
    border-radius: 10px;
}

.v-navigation-drawer>.v-navigation-drawer__content::-webkit-scrollbar-track {
    background-color: #f4f4f4;
    border-radius: 10px;
}
</style>
