import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import LoginPage from './components/LoginPage.vue';
import WelcomePage from './components/WelcomePage.vue';
import NotFoundPage from './components/NotFoundPage.vue';
import { VueReCaptcha } from 'vue-recaptcha-v3'
import Cookies from 'js-cookie';

const app = createApp(App);


app.config.globalProperties.$apiBaseUrl = "https://api.sgcgs.com"; // production
app.config.globalProperties.$apiBaseUrl = "http://localhost:8000"; // development
app.config.globalProperties.$expireInterval = 15; // minute(s)


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: WelcomePage,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            component: LoginPage,
        },
        {
            path: '/:catchAll(.*)',
            component: NotFoundPage,
        },
    ],
});

router.beforeEach((to, from, next) => {
    const authorized = Cookies.get('token');
    const requiresAuth = to.meta.requiresAuth;

    if (requiresAuth && !authorized) {
        next('/login');
    } else {
        next();
    }
});

app.use(router);
app.use(VueReCaptcha, {
    siteKey: '6LcVBiQmAAAAAHRd3e-vO9_mWW9-xN74Omq0hmC_',
    loaderOptions: {
        useRecaptchaNet: true
    }
})
app.mount('#app');