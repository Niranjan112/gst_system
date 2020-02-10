import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import ProfileDialogForm from './components/ProfileDialogForm'

Vue.config.productionTip = false
Vue.component('profile-form', ProfileDialogForm)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
