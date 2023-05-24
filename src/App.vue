<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
    name: 'App',
    data() {
        return {
            fullPath: "",
            requiresAuth: false,
        };
    },
    created() {
        this.$router.beforeEach((to, from, next) => {
            const meta = to.meta;
            if (meta.requiresAuth) {
                this.fullPath = to.fullPath;
                if (to.meta.requiresAuth) {
                    this.requiresAuth = true;
                    setInterval(this.checkAuthorization, 1000);
                }
            }
            next();
        });
    },
    methods: {
        validateAuthorization() {
            return Cookies.get("token");
        },
        checkAuthorization() {
            if (!this.validateAuthorization() && this.requiresAuth) {
                if (this.fullPath != "/") {
                    this.$router.replace(`/login?redirect=${encodeURIComponent(this.fullPath)}`);
                } else {
                    this.$router.replace(`/login`);
                }
            }
        }
    }
};
</script>