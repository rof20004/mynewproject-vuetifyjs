import Vue from 'vue'
import Vuex from 'vuex'

import shared from './shared'
import user from './user'
import meetup from './meetup'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    shared,
    user,
    meetup
  }
})
