import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      meta: {
        title: "Home",
        requiresAuth: true,
      },
      path: "/",
      component: () => import("@/layouts/MasterLayout.vue"),
      children: [
        {
          name: "layout",
          path: "/layout",
          component: () => import("@/views/LayoutView.vue"),
        },
        {
          name: "area",
          path: "/area",
          component: () => import("@/views/AreaView.vue"),
        },
        {
          name: "antennas",
          path: "/antennas/:id?", // Parámetro `id` opcional
          component: () => import("@/views/AntennasView.vue"),
          props: true, // Pasar el parámetro `id` como prop al componente
        },

        {
          name: "tags",
          path: "/tags/:id?",
          component: () => import("@/views/TagView.vue"),
          props: true,
        },

        {
          name: "operators",
          path: "/operators",
          component: () => import("@/views/OperatorView.vue"),
        },

        {
          name: "gptags",
          path: "/gptags",
          component: () => import("@/views/GTagsView.vue"),
        },

        {
          name: "gpareas",
          path: "/gpareas",
          component: () => import("@/views/GAreasView.vue"),
        },

        {
          name: "catTags",
          path: "/catTags",
          component: () => import("@/views/CTagsView.vue"),
        },

        {
          name: "catAntennas",
          path: "/catAntennas",
          component: () => import("@/views/CAntennaView.vue"),
        },

        {
          name: "monitoring",
          path: "/monitoring",
          component: () => import("@/views/MonitoringBeaconView.vue"),
        },
        {
          name: "planes",
          path: "/planes",
          component: () => import("@/views/MonitoringPlans.vue"),
        },

        {
          name: "rules",
          path: "/rules",
          component: () => import("@/views/RulesView.vue"),
        },

        {
          name: "reports",
          path: "/reports",
          component: () => import("@/views/ReportView.vue"),
        },

        {
          name: "reports",
          path: "/reports",
          component: () => import("@/views/ReportView.vue"),
        },

        {
          name: "companies",
          path: "/companies",
          component: () => import("@/views/MasterView.vue"),
        },

        {
          name: "customers",
          path: "/customers",
          component: () => import("@/views/CompanyView.vue"),
        },
      ],
    },
    {
      meta: {
        title: "Login",
      },
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },

    {
      path: "/:pathMatch(.*)*", // Cualquier ruta no especificada
      redirect: "/login", // Redirigir a login
    },
  ],
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !store.state.isAuthenticated) {
    next({ name: "login" });
  } else if (to.name === "login" && store.state.isAuthenticated) {
    if (store.state.role === "CUSTOMER_MASTER") {
      next({ name: "monitoring" });
    } else if (store.state.role === "COMPANY_MASTER") {
      next({ name: "customers" });
    } else if (store.state.role === "SUPER_MASTER") {
      next({ name: "companies" });
    } else {
      next();
    }
  } else if (to.path === "/" && store.state.isAuthenticated) {
    // Si el usuario está autenticado y accede a la raíz, redirigir según su rol
    if (store.state.role === "CUSTOMER_MASTER") {
      next({ name: "monitoring" });
    } else if (store.state.role === "COMPANY_MASTER") {
      next({ name: "customers" });
    } else if (store.state.role === "SUPER_MASTER") {
      next({ name: "companies" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
