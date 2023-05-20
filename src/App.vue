<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import Cookies from 'js-cookie';

function validateAuthorization() {
    return Cookies.get("token");
}

function checkAuthorization() {
    if (!validateAuthorization() && window.location.pathname !== "/login") {
        window.location.assign(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
}

if (window.location.pathname !== "/login") {
    setInterval(checkAuthorization, 1000);
}

export default {
    name: 'App',
};
</script>