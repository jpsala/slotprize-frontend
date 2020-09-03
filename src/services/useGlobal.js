import { computed, reactive, watch } from '@vue/composition-api'
import {
  Loading,
  QSpinnerDots
} from 'quasar'
const state = reactive({
  loading: false,
  spinner: false
})
const useGlobal = () => {
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
  return { startLoading, stopLoading, loading, showSpinner, hideSpinner }
}
export default useGlobal
