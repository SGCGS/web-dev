<template>
    <div class="login-register-page">
      <div class="login-register-box">
        <h2>Login/Register</h2>
        <el-form ref="loginForm" :model="loginForm" label-width="120px">
          <el-form-item label="Managebac Username">
            <el-input class="form-input" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Managebac Password">
            <el-input class="form-input" v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="Captcha">
            <vue-recaptcha
                @verify="onCaptchaVerify"
                :sitekey="siteKey"
                theme="light"
            ></vue-recaptcha>
            </el-form-item>
        </el-form>
        <el-button type="primary" class="form-button" @click="login">Login</el-button>
        <el-button type="primary" class="form-button" @click="register" v-if="showRegisterButton">Register</el-button>
      </div>
    </div>
  </template>

<style>
.login-register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F6F6F6;
  font-family: Arial, sans-serif;
}

.login-register-box {
  padding: 2rem;
  background-color: #FFFFFF;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.form-input {
  width: 100%;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.1);
  font-size: 1rem;
}

.form-button {
  width: 100%;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-top: 1rem;
  background-color: #0461CF;
  color: #FFFFFF;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.1);
  display: block;
  text-align: center;
  margin-bottom: 1rem;
}

.form-button:hover {
  background-color: #0072FF;
}

el-form-item__label {
  color: #8590A6;
}

el-form-item__content {
  color: #000000;
}

vue-recaptcha {
  border-radius: 0.25rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.1);
  overflow: hidden;
}

.grecaptcha-badge {
  visibility: hidden;
}
</style>
  
  <script>
  import VueRecaptcha from 'vue-recaptcha';
  import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
  
  export default {
    name: 'LoginRegisterPage',
    components: {
      VueRecaptcha,
      ElForm,
      ElFormItem,
      ElInput,
      ElButton,
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
            redirect_homepage();
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
            redirect_homepage();
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