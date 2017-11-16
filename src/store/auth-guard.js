import store from './'

export default (to, from, next) => {
  if (store.getters.user) {
    next()
  } else {
    next('/signin')
  }
}
