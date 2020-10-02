import { computed, reactive, watch } from '@vue/composition-api'
import {
  Loading,
  QSpinnerDots
} from 'quasar'
import { whichBox } from 'src/helpers'
const state = reactive({
  loading: false,
  spinner: false,
  isDev: whichBox().isDev
})
const url = new URL(location.href)
console.log('url', url)
let isDevInterval
const useGlobal = () => {
  clearInterval(isDevInterval)
  isDevInterval = setInterval(() => {
    state.isDev = whichBox().isDev
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
