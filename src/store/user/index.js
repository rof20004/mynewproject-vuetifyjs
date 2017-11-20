import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserForMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    registerUserForMeetup ({ commit, getters }, payload) {
      commit('setLoading', true)
      firebase.database().ref(`users/${getters.user.id}`).child('/registrations').push(payload)
        .then(data => commit('registerUserForMeetup', { id: payload, fbKey: data.key }))
        .catch(error => console.log(error))
        .then(() => commit('setLoading', false))
    },
    unregisterUserForMeetup ({ commit, getters }, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref(`users/${user.id}/registrations`).child(fbKey).remove()
        .then(() => commit('unregisterUserForMeetup'))
        .catch(error => console.log(error))
        .then(() => commit('setLoading', false))
    },
    signUserUp ({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        })
        .catch(error => {
          commit('setError', error)
          console.log(error)
        })
        .then(() => commit('setLoading', false))
    },
    signUserIn ({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        })
        .catch(error => {
          commit('setError', error)
          console.log(error)
        })
        .then(() => commit('setLoading', false))
    },
    clearError ({ commit }) {
      commit('clearError')
    },
    autoSignIn ({ commit }, payload) {
      commit('setUser', { id: payload.uid, registeredMeetups: [], fbKeys: {} })
    },
    logout ({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    fetchUserData ({ commit, getters }) {
      commit('setLoading', true)
      firebase.database().ref(`users/${getters.user.id}/registrations`).once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredMeetups = []
          let swappedPairs = {}
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key])
            swappedPairs[dataPairs] = key
          }
          const updatedUser = {
            id: getters.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          }
          commit('setUser', updatedUser)
        })
        .catch(error => console.log(error))
        .then(() => commit('setLoading', false))
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})

export default store
