<script>
import ColorBackground from './ColorBackgroundGradient.vue';
import "./WelcomePage.css";

export default {
    name: 'WelcomePage',
    components: {
        ColorBackground
    }
};
</script>

<template>
    <div class="text-container">
        <h2><span style="color: #0072FF;">sgcgs</span><span style="color: gray;">.</span><span
                style="color: #0072FF;">com</span></h2>
    </div>
    <ColorBackground />
</template>