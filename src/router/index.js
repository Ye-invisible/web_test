import { createRouter, createWebHistory } from 'vue-router'
import Buy from '@/components/Buy.vue' 
import Movie from '@/components/SeatMovie.vue'
import Tickets from '@/components/Tickets.vue'
import singleForm from '@/components/singleForm.vue'
import groupForm from '@/components/groupForm.vue'
import Welcome from '@/components/Welcome.vue'
import WelcomePage from '@/views/WelcomePage.vue' 
import GroupTable from '@/components/groupTable.vue'
import App from '@/App.vue'
import SeatView from '@/views/SeatView.vue'
import films from '@/components/films.vue'

const routes = [
  { 
    path: '/', 
    component: WelcomePage  // 将根路径指向真正的欢迎界面
  },
  { 
    path: '/buy', 
    component: Buy, 
    children: [
      { path: 'single', component: singleForm },
      { path: 'group', component: groupForm },
    { path: '', redirect: '/buy/single' } // 默认重定向到 single
  ]},
  // { path: '/single', component: singleForm },
  // { path: '/group', component: groupForm },
  { path: '/movie', component: Movie},
  { path: '/tickets', component: Tickets},
  { path: '/welcome', component: Welcome},
  { path: '/groupTable', component: GroupTable},
  { path: '/app', component: App},
  { path: '/seats', component: SeatView},
  { path: '/films', component: films } // 添加新页面的路由
]

const router = createRouter({
  history: createWebHistory(), 
  routes 
})

export default router