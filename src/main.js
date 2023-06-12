import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './app/App.vue';
import router from './router';
import log from 'js-logger';
import moment from 'moment-timezone';

const app = createApp(App);
app.use(moment)
app.use(router);
app.use(createPinia());
app.mount('#app');

log.useDefaults();
