import { createSSRApp } from "vue";
import "./main.css";
import App from "./App.vue";
import { createPinia } from "pinia";
export function createApp() {
  const pinia = createPinia();
  const app = createSSRApp(App);
  app.use(pinia);
  return {
    app,
  };
}
