import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import stores from './stores'
import router from './router'
import vuesticGlobalConfig from '@services/vuestic-ui/global-config'
import App from './App.vue'
import { useAuthStore } from '@modules/auth.module'

// Create Vue application
const app = createApp(App)

// Use necessary plugins and stores
app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))

const authStore = useAuthStore()
authStore.checkAuth()
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresCaptcha)) {
    app.use(VueReCaptcha, {
      siteKey: import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY,
      loaderOptions: {
        useRecaptchaNet: true,
        autoHideBadge: true,
      },
    })
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
