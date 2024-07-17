import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { Quill, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageUploader from 'quill-image-uploader'
import MagicUrl from 'quill-magic-url'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'

import stores from './stores'
import router from './router'
import vuesticGlobalConfig from '@services/vuestic-ui/global-config'
import App from './App.vue'
import { useAuthStore } from '@modules/auth.module'
import { useFileStore } from './stores/modules/file.module'
// Create Vue application
const app = createApp(App)

// Use necessary plugins and stores
app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))

// Register modules for QuillEditor
Quill.register('modules/magicUrl', MagicUrl)
Quill.register('modules/imageUploader', ImageUploader)
Quill.register('modules/blotFormatter', BlotFormatter)

// Quill: Inline Style
// Quill.register(Quill.import("attributors/class/align"), true);
// Quill.register(Quill.import("attributors/class/font"), true);
// Quill.register(Quill.import("attributors/style/align"), true);
// Quill.register(Quill.import("attributors/style/font"), true);

const fileStore = useFileStore()
const url = (import.meta.env.VITE_APP_BASE_URL as string).slice(0, -3)

// Define global options for QuillEditor
export const globalOptions = {
  // debug: 'info',
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
      [{ script: 'sub' }, { script: 'super' }],
      ['clean'],
    ],
    imageUploader: {
      upload: (file: any) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData()
          formData.append('Files', file)
          fileStore
            .uploadFile(formData)
            .then((response) => {
              resolve(url + response)
            })
            .catch((error) => {
              reject('Upload failed')
              console.error('Error:', error)
            })
        })
      },
    },
    magicUrl: true,
    blotFormatter: {},
  },
  placeholder: 'Say something...',
  theme: 'snow',
}

// set default globalOptions prop
QuillEditor.props.globalOptions.default = () => globalOptions

// register QuillEditor component
app.component('QuillEditor', QuillEditor)

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
