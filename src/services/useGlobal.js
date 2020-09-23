import { computed, reactive, watch } from '@vue/composition-api'
import {
  Loading,
  QSpinnerDots
} from 'quasar'
const state = reactive({
  loading: false,
  spinner: false,
  isDev: (localStorage.getItem('isDev') === 'true')
})
let isDevInterval
console.log('ants state.isDev', state.isDev)
const useGlobal = () => {
  console.log('useGlobal state.isDev', state.isDev, typeof state.isDev)
  clearInterval(isDevInterval)
  isDevInterval = setInterval(() => {
    state.isDev = (localStorage.getItem('isDev') === 'true')
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
  watch(() => state.spinner, (value) => {
    if (value) Loading.show({ spinner: QSpinnerDots })
    else Loading.hide()
  })
  return { startLoading, stopLoading, loading, showSpinner, hideSpinner, isDev: state.isDev }
}
export default useGlobal
