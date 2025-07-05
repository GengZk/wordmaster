import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Words from './views/Words.vue'
import Settings from './views/Settings.vue'
import Import from './views/Import.vue'
import Manage from './views/Manage.vue'
import './style.css'

const routes = [
  { path: '/', component: Home },
  { path: '/words/:themeId', component: Words },
  { path: '/settings', component: Settings },
  { path: '/import', component: Import },
  { path: '/manage', component: Manage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app') 