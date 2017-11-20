// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'

import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'
import DateFilter from './filters/date'
import * as firebase from 'firebase'
import Alert from './components/Shared/Alert.vue'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog.vue'

Vue.use(Vuetify, {
  theme: {
    primary: '#D32F2F',
    accent: '#FF5252',
    secondary: '#bdbdbd',
    info: '#42A5F5',
    warning: '#ffa000',
    error: '#D50000',
    success: '#81C784'
  }
})

Vue.filter('date', DateFilter)
Vue.component('app-alert', Alert)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)

Vue.config.productionTip = false

Vue.prototype.moment = moment

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created () {
    var config = {
      apiKey: 'AIzaSyBgd6aoAljMCflW56-me7EH_1wJfMkmL5k',
      authDomain: 'meetups-vuejs.firebaseapp.com',
      databaseURL: 'https://meetups-vuejs.firebaseio.com',
      projectId: 'meetups-vuejs',
      storageBucket: 'meetups-vuejs.appspot.com',
      messagingSenderId: '222708983648'
    }
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})
