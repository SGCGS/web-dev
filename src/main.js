import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

import LoginPage from './components/LoginPage.vue';
import WelcomePage from './components/WelcomePage.vue';
import NotFoundPage from './components/NotFoundPage.vue';

import { VueReCaptcha } from 'vue-recaptcha-v3'
import Cookies from 'js-cookie';

const app = createApp(App);


app.config.globalProperties.$apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
app.config.globalProperties.$expireInterval = process.env.VUE_APP_COOKIE_EXPIRE_INTERVAL; // minute(s)


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
            meta: { requiresAuth: true }
        },
    ],
});

router.beforeEach((to, from, next) => {
    const authorized = Cookies.get('token');
    const requiresAuth = to.meta.requiresAuth;

    if (requiresAuth && !authorized) {
        if (to.fullPath != "/") {
            next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
        } else {
            next(`/login`);
        }
    } else {
        next();
    }
});

app.use(router);
app.use(VueReCaptcha, {
    siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY,
    loaderOptions: {
        useRecaptchaNet: true
    }
})
app.mount('#app');