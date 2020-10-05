import Vue from 'vue'
import App from './App.vue'
import news from './components/news/news.vue'
import lyrics from './components/lyrics/lyrics.vue'
import intro from './components/intro/intro.vue'

import './css/main.css'

import VueRouter from 'vue-router'
import './plugins/element.js'

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {
    path:'/',
    name:'default',
    redirect:'/intro'
  },
  {
    path:'/intro',
    name:'intro',
    component:intro
  },
  {
    path:'/news',
    name:'news',
    component:news
  },
  {
    path:'/lyrics',
    name:'lyrics',
    component:lyrics
  }

];

const router = new VueRouter({routes});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
