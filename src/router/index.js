import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Meetups from '@/components/Meetup/Meetups'
import CreateMeetup from '@/components/Meetup/CreateMeetup'
import Meetup from '@/components/Meetup/Meetup'
import Profile from '@/components/User/Profile'
import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'
import AuthGuard from '../store/auth-guard.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home, beforeEnter: AuthGuard },
    { path: '/meetups', name: 'Meetups', component: Meetups, beforeEnter: AuthGuard },
    { path: '/meetup/new', name: 'CreateMeetup', component: CreateMeetup, beforeEnter: AuthGuard },
    { path: '/meetups/:id', name: 'Meetup', props: true, component: Meetup, beforeEnter: AuthGuard },
    { path: '/profile', name: 'Profile', component: Profile, beforeEnter: AuthGuard },
    { path: '/signup', name: 'Signup', component: Signup },
    { path: '/signin', name: 'Signin', component: Signin }
  ]
})

export default router
