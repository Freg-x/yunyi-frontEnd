import Vue from 'vue'
import App from './App.vue'
import mobile from './components/common/mobile.vue'
import news from './components/news/news.vue'
import singleNews from './components/news/singleNews.vue'
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
    path:'/news/:newsId',
    name:'singleNews',
    component:singleNews
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
