import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Chadan from '../views/chadan.vue'
import Kele from '../views/kele.vue'
import Jd from '../views/jd.vue'
import Xiaolong from '../views/xiaolong.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/chadan',
        name: 'chadan',
        component: Chadan
    },
    {
        path: '/kele',
        name: 'kele',
        component: Kele
    },
    {
        path: '/jd',
        name: 'jd',
        component: Jd
    },
    {
        path: '/xiaolong',
        name: 'xiaolong',
        component: Xiaolong
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: "*",
        redirect: "/"
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router