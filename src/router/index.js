import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Singer from '@/pages/Singer'
import SingerDetail from '@/pages/SingerDetail'
import SongPlay from '@/pages/SongPlay'
import Search from '@/pages/Search'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path: '/',
  		redirect: '/index'
  	},
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer
    },
    {
      path: '/singer/:id',
      name: 'SingerDetail',
      component: SingerDetail
    },
    {
      path:'/song/:id/:albummid',
      name:'SongPlay',
      component:SongPlay
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
