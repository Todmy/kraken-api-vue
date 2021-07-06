import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import localization from "./localization";
import titleMixin from "./mixins/title";

createApp(App).use(store).use(localization).mixin(titleMixin).mount("#app");
