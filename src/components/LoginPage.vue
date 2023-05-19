<template>
    <div class="container">
        <h2>Login with <span style="color: #0072FF;">ManageBac</span></h2>
        <form :model="loginForm">
            <label style="font-weight: bold;">Username</label>
            <input class="form-input" v-model="loginForm.username">
            <label style="font-weight: bold;">Password</label>
            <input class="form-input" v-model="loginForm.password" type="password">
            <vue-recaptcha @verify="onCaptchaVerify" :sitekey="siteKey" theme="light"></vue-recaptcha>
            <button type="submit" class="form-button">Login</button>
        </form>
    </div>
    <ColorBackground />
</template>

<script>
// import VueRecaptcha from 'vue-recaptcha';
import "./LoginPage.css";
import ColorBackground from './ColorBackgroundGradient.vue';

export default {
    name: 'LoginPage',
    components: {
        // VueRecaptcha,
        ColorBackground
    },
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
                managebactoken: '',
                rt: '',
            },
            siteKey: '',
            showRegisterButton: true,
        };
    },
    mounted() {
        fetch('api.scgcs.atunemic.com/rsk')
            .then(response => response.text())
            .then(siteKey => {
                this.siteKey = siteKey;
            })
            .catch(error => {
                console.error(error);
                alert('Failed to retrieve ReCaptcha site key.');
            });
    },
    methods: {
        onCaptchaVerify(response) { // TODO BUG: captcha doesn't work for some reason
            this.loginForm.rt = response;
        },
        async login() {
            try {
                const managebacToken = await this.getManagebacToken();
                this.loginForm.managebactoken = managebacToken;
                const response = await this.sendLoginRequest();
                if (response.ok) {
                    const cookieHeader = response.headers.get('Set-Cookie');
                    document.cookie = cookieHeader;
                    // redirect_homepage();
                } else {
                    const json = await response.json();
                    alert(json.detail); // show failure message
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred. Please try again.'); // show error message
            }
        },
        async register() {
            try {
                const managebacToken = await this.getManagebacToken();
                this.loginForm.managebactoken = managebacToken;
                const response = await this.sendRegisterRequest();
                if (response.ok) {
                    const cookieHeader = response.headers.get('Set-Cookie');  // Not sure about cookie: verify with Kita-san
                    document.cookie = cookieHeader;
                    // redirect_homepage();
                } else {
                    const json = await response.json();
                    alert(json.detail);
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred. Please try again.');
            }
        },
        async getManagebacToken() {
            const url = 'https://api.scgcs.atunemic.com/managebac';
            const params = {
                username: this.loginForm.username,
                password: this.loginForm.password,
                rt: this.loginForm.rt,
            };
            const query = Object.keys(params)
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
            const response = await fetch(`${url}?${query}`);
            if (response.ok) {
                const token = await response.text();
                return token;
            } else {
                const json = await response.json();
                throw new Error(json.detail);
            }
        },
        async sendLoginRequest() {
            const url = 'https://api.scgcs.atunemic.com/login';
            const params = {
                managebactoken: this.loginForm.managebactoken,
            };  // TODO verify API format with Kita-san
            const query = Object.keys(params)
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: query,
            };
            const response = await fetch(url, options);
            return response;
        },
        async sendRegisterRequest() {
            const url = 'https://api.scgcs.atunemic.com/register';
            const params = {
                managebactoken: this.loginForm.managebactoken,
            };
            const query = Object.keys(params)
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: query,
            };
            const response = await fetch(url, options);
            return response;
        },
        async redirect_homepage() {
            // TODO
        }
    },
};
</script>