import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/experiment/key',
  },
  {
    path: '/experiment/key',
    name: 'key',
    component: () => import('@/views/KeyTestView.vue'),
    meta: { title: '按键可用性测试' },
  },
  {
    path: '/experiment/direction',
    name: 'direction',
    component: () => import('@/views/DirectionTestView.vue'),
    meta: { title: '方向键串键测试' },
  },
  {
    path: '/experiment/tigger',
    name: 'trigger',
    component: () => import('@/views/TriggerTestView.vue'),
    meta: { title: '扳机测试' },
  },
  {
    path: '/experiment/joystick',
    name: 'joystick',
    component: () => import('@/views/JoystickTestView.vue'),
    meta: { title: '摇杆死区测试' },
  },
  {
    path: '/experiment/vibrate',
    name: 'vibration',
    component: () => import('@/views/VibrationTestView.vue'),
    meta: { title: '震动测试' },
  },
  {
    path: '/experiment/diagnostics',
    name: 'diagnostics',
    component: () => import('@/views/PollingRateView.vue'),
    meta: { title: '摇杆回报率测试' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/experiment/key',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? '手柄诊断')} · Gamepad Lab`
})

export default router
