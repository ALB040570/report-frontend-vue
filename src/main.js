import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './shared/config/router'
import App from './app/App.vue'

// базовые стили/токены из NSI
import './shared/styles/tokens.css'
import './shared/styles/base.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
