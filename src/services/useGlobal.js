import { computed, reactive } from '@vue/composition-api'
const state = reactive({
  loading: false,
  forExport: {
    test: 1
  }
})
const useGlobal = () => {
  const startLoading = () => {
    state.loading = true
  }
  const stopLoading = () => {
    state.loading = false
  }
  const loading = computed(() => {
    return state.loading
  })
  return { startLoading, stopLoading, loading }
}
export default useGlobal
