import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import localization from "./localization";

createApp(App).use(store).use(localization).mount("#app");
