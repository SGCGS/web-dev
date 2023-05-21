# Front-End Repository Of SGCGS Project

## Install Development Environment
Install Node.js and Git before you start.  
At working directory:
```
git clone https://github.com/SGCGS/web-dev.git
```
```
npm install vue@next
npm install -g @vue/cli
npm install vue-recaptcha-v3
npm install js-cookie@latest
npm install vue-router@4
```

### Debug & Realtime Preview
At repository path:
```
npm run serve
```
Start the browsers to debug or use configured debug feature of Visual Studio Code (at debug tab).

### Deployment
```
npm run build
```
Nginx Configuration
```
location / {
    try_files $uri $uri/ /index.html;
}
```
