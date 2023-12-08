import { useUserStore } from "@/stores";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes:Readonly<RouteRecordRaw[]> = [
    {
        path: "/",
        name: "/",
        redirect: '/login'
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('@/components/Login.vue')
    },
    {
        path: "/home",
        name: "Home",
        component: () => import('@/components/Home.vue'),
        children: [
            {
                path: "node",
                name: "Node",
                component: () => import('@/components/Home/Node.vue')
            },
            {
                path: "clients",
                name: "Clients",
                component: () => import('@/components/Home/Clients.vue')
            },
            {
                path: "subscriptions",
                name: "Subscriptions",
                component: () => import('@/components/Home/Subscriptions.vue'),
            },
            {
                path: "config",
                name: "Config",
                component: () => import('@/components/Home/Config.vue')
            },
            {
                path: "debug",
                name: "Debug",
                component: () => import('@/components/Home/Debug.vue')
            },
            {
                path: "/setting",
                name: "Setting",
                component: () => import('@/components/Home/Setting.vue')
            }
        ],
        meta: {
            requiresAuth: true,
        }
    },
   
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

// Global preroute
router.beforeEach((to, _from, next) => {
    const user = useUserStore()
    const isAuthenticated :boolean = user.getAuthenticated

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/login")
    } else if (to.name === "Login" && isAuthenticated) {
        next("/home")
    } else {
        next()
    }
})
export default router