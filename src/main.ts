import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// app.use(VueRecaptchaPlugin)
// app.use(VueRecaptchaPlugin, {
//   v2SiteKey: '6LfGN2ssAAAAAJaeRO6aHtqrGFU66xGbcnt5bkQF',
//   // v3SiteKey: '6LfGN2ssAAAAAFBOb2IyM_GSiZp2q6h1Q6NNamGa',
// })

app.mount('#app')