import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes:Readonly<RouteRecordRaw[]> = [
    {
        path: "/",
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
        meta: {
            requiresAuth: true,
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

// Global preroute
router.beforeEach((to, _from, next) => {
    const isAuthenticated = true

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/login")
    } else if (to.name === "Login" && isAuthenticated) {
        next("/home")
    } else {
        next()
    }
})
export default router