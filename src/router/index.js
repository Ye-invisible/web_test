import { createRouter, createWebHistory } from 'vue-router'
import Buy from '@/components/Buy.vue' 
import Movie from '@/components/Movie.vue'
import Tickets from '@/components/Tickets.vue'
import singleForm from '@/components/singleForm.vue'
import groupForm from '@/components/groupForm.vue'
import Welcome from '@/components/Welcome.vue'
import GroupTable from '@/components/groupTable.vue'
import App from '@/App.vue'
import SeatView from '@/views/SeatView.vue'

const routes = [
  // { path: '/buy', component: Buy, children: [
  //   { path: 'single', component: singleForm },
  //   { path: 'group', component: groupForm },
  //   { path: '', redirect: 'single' } // 默认重定向到 single
  // ]},
  { path: '/', redirect: '/buy' }, // 添加根路径重定向
  { path: '/single', component: singleForm },
  { path: '/group', component: groupForm },
  { path: '/movie', component: Movie},
  { path: '/tickets', component: Tickets},
  { path: '/welcome', component: Welcome},
  { path: '/groupTable', component: GroupTable},
  { path: '/app', component: App},
  { path: '/seats', component: SeatView},
]

const router = createRouter({
  history: createWebHistory(), 
  routes 
})

export default router