import { computed, reactive, watch } from '@vue/composition-api'
import {
  Loading,
  QSpinnerDots
} from 'quasar'
const state = reactive({
  loading: false,
  spinner: false,
  isDev: false
})
const url = new URL(location.href)
console.log('url', url)
let isDevInterval
console.log('ants state.isDev', state.isDev)
const useGlobal = () => {
  clearInterval(isDevInterval)
  isDevInterval = setInterval(() => {
    const url = document.location.hostname
    const devBoxes = ['dev.slotoprizes.tagadagames.com', 'localhost', 'bo.dev.slotoprizes.tagadagames.com']
    state.isDev = devBoxes.includes(url)
  }, 2000)
  // const isDev = computed(() => state.isDev)
  const startLoading = () => {
    state.loading = true
  }
  const stopLoading = () => {
    state.loading = false
  }
  const showSpinner = () => {
    state.spinner = true
  }
  const hideSpinner = () => {
    state.spinner = false
  }
  const loading = computed(() => {
    return state.loading
  })
  const isDev = computed(() => {
    return state.isDev
  })
  watch(() => state.spinner, (value) => {
    if (value) Loading.show({ spinner: QSpinnerDots })
    else Loading.hide()
  })
  return { startLoading, stopLoading, loading, showSpinner, hideSpinner, isDev }
}
export default useGlobal
