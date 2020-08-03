/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
import { ref, onMounted, onUnmounted, onBeforeMount } from '@vue/composition-api'
import { throttle } from '../helpers'

const Screen = ref({ lt: {}, gt: {}, name: '', xs: false, sm: false, md: false, lg: false, xl: false })
const setScreenValues = (data) => {
  if (!data) {
    return
  }
  let target = data
  if (data.target) {
    target = data.target
  }
  Screen.value.X = target.ScreenX
  Screen.value.Y = target.ScreenY
  Screen.value.width = target.innerWidth
  if (target.innerWidth < 600) {
    Screen.value.name = 'xs'
    Screen.value.xs = true
    Screen.value.sm = false
    Screen.value.md = false
    Screen.value.lg = false
    Screen.value.xl = false
    Screen.value.lt.sm = true
    Screen.value.lt.md = true
    Screen.value.lt.lg = true
    Screen.value.lt.xl = true
    Screen.value.gt.xs = false
    Screen.value.gt.sm = false
    Screen.value.gt.md = false
    Screen.value.gt.lg = false
    Screen.value.gt.xl = false
  } else if (target.innerWidth < 1024) {
    Screen.value.name = 'sm'
    Screen.value.xs = false
    Screen.value.sm = true
    Screen.value.md = false
    Screen.value.lg = false
    Screen.value.xl = false
    Screen.value.lt.sm = false
    Screen.value.lt.md = true
    Screen.value.lt.lg = true
    Screen.value.lt.xl = true
    Screen.value.gt.xs = true
    Screen.value.gt.sm = false
    Screen.value.gt.md = false
    Screen.value.gt.lg = false
    Screen.value.gt.xl = false
  } else if (target.innerWidth < 1440) {
    Screen.value.name = 'md'
    Screen.value.xs = false
    Screen.value.sm = false
    Screen.value.md = true
    Screen.value.lg = false
    Screen.value.xl = false
    Screen.value.lt.sm = false
    Screen.value.lt.md = false
    Screen.value.lt.lg = true
    Screen.value.lt.xl = true
    Screen.value.gt.xs = true
    Screen.value.gt.sm = true
    Screen.value.gt.md = false
    Screen.value.gt.lg = false
    Screen.value.gt.xl = false
  } else {
    Screen.value.name = 'xl'
    Screen.value.xs = false
    Screen.value.sm = false
    Screen.value.md = false
    Screen.value.lg = false
    Screen.value.xl = true
    Screen.value.lt.sm = false
    Screen.value.lt.md = false
    Screen.value.lt.lg = false
    Screen.value.lt.xl = false
    Screen.value.gt.xs = true
    Screen.value.gt.sm = true
    Screen.value.gt.md = true
    Screen.value.gt.lg = true
    Screen.value.gt.xl = false
  }
}
const windowResize = (e) => setScreenValues(e.target)
export default () => {
  onBeforeMount(() => setScreenValues(window))
  onMounted(() => {
    setScreenValues(window)
    window.addEventListener('resize', throttle(windowResize, 500))
  })
  onUnmounted(() => {
    window.removeEventListener('resize', throttle(windowResize, 500))
  })
  return Screen
}
