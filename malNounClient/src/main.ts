/* JS imports */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createBootstrap } from "bootstrap-vue-next";
import App from './App.vue'
import router from './router'

/* CSS Imports */
import './assets/main.css' // Our main CSS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createBootstrap())
app.mount('#app')
