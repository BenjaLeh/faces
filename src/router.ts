import Vue from 'vue'
import Router from 'vue-router'
import Main from './components/layout/Main.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'
import { Component } from 'vue-router/types/router';

// Faces
import Detection from './components/faces/Detection.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    /* Routes WITHOUT Layout */
    route('/home', 'home', Home, null),

    /* Routes WITH Layout */
    route('/', null, Main, [
      route('/about', 'about', About, null),
      route('/detection', 'detection', Detection, null)
    ])
  ]
})

/**
 * Route builder
 */
function route (path: String, name: String, component: Component, children: any) {
  return {
    exact: true,
    path,
    name,
    children,
    component
  }
}
