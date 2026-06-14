import { createApp } from "vue";
import vue3GoogleLogin from "vue3-google-login";
import App from "./App.vue";
import "./assets/index.css";
import router from "./router";
import i18n from "./i18n";

const app = createApp(App);

app.use(router);
app.use(i18n);
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

app.mount("#app");
