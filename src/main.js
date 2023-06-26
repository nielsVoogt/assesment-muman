import { createApp } from 'vue'
import './style/app.scss'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.mount('#app')
