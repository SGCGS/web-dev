<script>
import ColorBackground from './ColorBackgroundG2.vue';
import "./NotFoundPage.css";

export default {
    name: 'NotFoundPage',
    methods: {
        startCountdown() {
            if (this.countdown > 0) {
                this.countdown--;
                setTimeout(this.startCountdown, 1000);
            } else {
                this.$router.push('/');
            }
        },
    },
    mounted() {
        setTimeout(this.startCountdown, 300);
    },
    components: {
        ColorBackground
    },
    data() {
        return {
            background: 'linear-gradient(to right, #f45c4a, #f3c033)',
            countdown: 5,
        };
    }
};
</script>

<template>
    <div class="container">
        <h2 class="welcoming-text"><span style="color: #FF3333;">Not Found 404</span></h2>
        Return to homepage in {{ countdown }}
    </div>
    <ColorBackground :background="background" />
</template>