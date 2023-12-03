import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "@/router";

import vue3GoogleLogin from "vue3-google-login";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import axios from "axios";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

axios.defaults.baseURL = "http://localhost:4001/";

createApp(App)
  .use(router)
  .use(pinia)
  .use(vue3GoogleLogin, {
    clientId:
      "1062828160998-0sskrkgmv6r9fhvsr02b6pglr4mo1opv.apps.googleusercontent.com",
  })
  .mount("#app");
