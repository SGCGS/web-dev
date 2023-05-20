<script>
import ColorBackground from './ColorBackgroundG1.vue';
import "./WelcomePage.css";

export default {
    name: 'WelcomePage',
    components: {
        ColorBackground
    }
};
</script>

<template>
    <div class="container">
        <h2 class="welcoming-text">
            Welcome to <span style="color: #0072FF;">SGCGS</span><span style="color: gray;">.</span><span
                style="color: #0072FF;">COM</span>
        </h2>
    </div>
    <ColorBackground />
</template>