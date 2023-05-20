<script>
import ColorBackground from './ColorBackgroundG1.vue';
import "./NotFoundPage.css";

export default {
    name: 'NotFoundPage',
    components: {
        ColorBackground
    },
    data() {
        return {
            background: 'linear-gradient(to right, #f45c4a, #f3c033)',
        };
    }
};
</script>

<template>
    <div class="container">
        <h2 class="welcoming-text"><span style="color: #FF3333;">Not Found 404</span></h2>
    </div>
    <ColorBackground :background="background" />
</template>