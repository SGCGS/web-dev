<template>
    <div class="container">
        <h2>Login with <span style="color: #0072FF;">ManageBac</span></h2>
        <form @submit="handleSubmit" ref="loginForm">
            <label style="font-weight: bold;">Username</label>
            <input class="form-input" name="username" v-model="username" required>
            <label style="font-weight: bold;">Password</label>
            <input class="form-input" type="password" name="password" v-model="password" required>
            <button type="submit" :disabled="isLoading || isError" class="form-button">
                <span v-if="isLoading">Loading...</span>
                <template v-else-if="isError">
                    {{ errorDetail }} ({{ remainingSeconds }})
                </template>
                <span v-else>Login</span>
            </button>
        </form>
    </div>
    <ColorBackground :background="background" />
</template>

<script>
import "./LoginPage.css";
import ColorBackground from './ColorBackgroundG2.vue';
import { useReCaptcha } from 'vue-recaptcha-v3';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
    setup() {
        const router = useRouter();

        function validateAuthorization() {
            return Cookies.get("token");
        }

        if (validateAuthorization()) {
            router.push("/");
        }

        const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();
        const recaptcha = async () => {
            await recaptchaLoaded();
            const token = await executeRecaptcha('login');
            return token;
        };

        const isLoading = ref(false);
        const isError = ref(false);
        const errorDetail = ref('');
        const remainingSeconds = ref(0);
        let countdownTimer = null;

        const startCountdown = () => {
            let seconds = 3;
            remainingSeconds.value = seconds;

            countdownTimer = setInterval(() => {
                seconds--;
                remainingSeconds.value = seconds;

                if (seconds === 0) {
                    clearInterval(countdownTimer);
                    isError.value = false;
                    errorDetail.value = '';
                }
            }, 1000);
        };

        return {
            recaptcha,
            isLoading,
            isError,
            errorDetail,
            remainingSeconds,
            startCountdown
        };
    },
    name: 'LoginPage',
    components: {
        ColorBackground
    },
    data() {
        return {
            username: '',
            password: '',
            rt: '',
            background: 'linear-gradient(to right, #68dba4, #167dff)',
        };
    },
    methods: {
        async handleSubmit(event) {
            event.preventDefault();
            const form = this.$refs.loginForm;
            if (form.checkValidity()) {
                this.isLoading = true;

                this.rt = await this.recaptcha();

                const payload = {
                    username: this.username,
                    password: this.password,
                    rt: this.rt
                };

                const response = await fetch(`${this.$apiBaseUrl}/login/managebac`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    const cookie = responseData.token;
                    var now = new Date();
                    var future = new Date(now.getTime() + this.$expireInterval * 60000);
                    Cookies.set('token', cookie, { expires: future });
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectParam = urlParams.get('redirect');
                    if (redirectParam) {
                        this.$router.push(redirectParam);
                    } else {
                        this.$router.push('/');
                    }
                } else if (response.status === 401) {
                    const errorJson = await response.json();
                    this.isError = true;
                    this.errorDetail = errorJson.detail;
                    this.startCountdown();
                }

                this.isLoading = false;
            }
        }
    }
};
</script>
