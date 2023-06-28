import { createApp } from "vue";
import "./style/app.scss";
import router from "./router";
import App from "./App.vue";
const app = createApp(App);
import { setupCalendar } from "v-calendar";

app.use(setupCalendar, {});
app.use(router);
app.mount("#app");
