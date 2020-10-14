import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/index.vue')
  },
  {
    path: '/bs/normal',
    component: () => import('../views/bs/normal.vue')
  },
  {
    path: '/bs/zoom',
    component: () => import('../views/bs/zoom.vue')
  },
  {
    path: '/native/normal',
    component: () => import('../views/native/normal.vue')
  },
  {
    path: '/native/zoom',
    component: () => import('../views/native/zoom.vue')
  },

  {
    path: '/normal-x',
    component: () => import('../views/normal-x.vue')
  },
  {
    path: '/normal-y',
    component: () => import('../views/normal-y.vue')
  },
  {
    path: '/normal-xy',
    component: () => import('../views/normal-xy.vue')
  },
  {
    path: '/zoom',
    component: () => import('../views/zoom.vue')
  },

  {
    path: '/complex',
    component: () => import('../views/complex')
  },
  {
    path: '/scrollview-hooks',
    component: () => import('../views/scrollview-hooks')
  },
  {
    path: '/swipe-cell',
    component: () => import('../views/swipe-cell')
  },
  {
    path: '/image-viewer',
    component: () => import('../views/image-viewer')
  },

  {
    path: '/form',
    component: () => import('../views/form')
  },

  // 嵌套
  {
    path: '/nested/nested1',
    component: () => import('../views/nested/nested1')
  },
  {
    path: '/nested/nested2',
    component: () => import('../views/nested/nested2')
  },
  {
    path: '/nested/nested3',
    component: () => import('../views/nested/nested3')
  },
  {
    path: '/nested/nested-native',
    component: () => import('../views/nested/nested-native')
  },

  // 图片懒加载
  {
    path: '/lazyload',
    component: () => import('../views/lazyload')
  },

  // PullLoader
  {
    path: '/pull-loader/top-and-bottom',
    component: () => import('../views/pull-loader/top-and-bottom')
  },
  {
    path: '/pull-loader/left-and-right',
    component: () => import('../views/pull-loader/left-and-right')
  },
  {
    path: '/pull-loader/all',
    component: () => import('../views/pull-loader/all')
  },

  // 分页
  {
    path: '/paging',
    component: () => import('../views/paging')
  },

  // Picker
  {
    path: '/picker/picker1',
    component: () => import('../views/picker/picker1')
  },
  {
    path: '/picker/picker2',
    component: () => import('../views/picker/picker2')
  },
  {
    path: '/picker/picker3',
    component: () => import('../views/picker/picker3')
  },
  {
    path: '/picker/picker4',
    component: () => import('../views/picker/picker4')
  },

  // snap 
  {
    path: '/snap/snap',
    component: () => import('../views/snap/snap.vue')
  },
  {
    path: '/snap/api',
    component: () => import('../views/snap/api.vue')
  },
  {
    path: '/snap/nested-cross',
    component: () => import('../views/snap/nested-cross.vue')
  },
  {
    path: '/snap/nested-same',
    component: () => import('../views/snap/nested-same.vue')
  },
  {
    path: '/snap/with-pullloader',
    component: () => import('../views/snap/with-pullloader.vue')
  },
  {
    path: '/snap/with-lazyload',
    component: () => import('../views/snap/with-lazyload.vue')
  },
  {
    path: '/snap/with-scrollbar',
    component: () => import('../views/snap/with-scrollbar.vue')
  },

  // touch
  {
    path: '/touch/touch',
    component: () => import('../views/touch/touch.vue')
  },
  {
    path: '/touch/native',
    component: () => import('../views/touch/native.vue')
  },

  // cases
  {
    path: '/cases/story',
    component: () => import('../views/cases/story.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
