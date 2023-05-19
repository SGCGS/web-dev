import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import LoginPage from './components/LoginPage.vue';
import WelcomePage from './components/WelcomePage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: WelcomePage,
        },
        {
            path: '/login',
            component: LoginPage,
        },
    ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');