import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import mobile from './components/common/mobile.vue'
import newsUploader from './components/common/newsUploader.vue'
import transUploader from './components/common/transUploader.vue'

import news from './components/news/news.vue'
import singleNews from './components/news/singleNews.vue'
import commentArea from './components/news/commentArea.vue'
import transList from './components/news/transList.vue'

import lyrics from './components/lyrics/lyrics.vue'
import intro from './components/intro/intro.vue'

import './css/main.css'

import VueRouter from 'vue-router'
import './plugins/element.js'
import globalVariable from './plugins/global_variable.js'

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.prototype.$axios = axios;
Vue.prototype.GLOBAL = globalVariable;

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
    path:'mobile',
    name:'mobile',
    component:mobile
  },
  {
    path:'/news',
    name:'news',
    component:news
  },
  {
    path:'/news/upload',
    name:'newsUploader',
    component:newsUploader
  },
  {
    path:'/news/:newsId',
    name:'singleNews',
    component:singleNews,
    children:[
      {path:'', component: commentArea},
      {path:'comment', component: commentArea},
      {path:'trans', component: transList}
    ]
  },
  {
    path:'/news/:newsId/transupload',
    name:'transUploader',
    component:transUploader
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
