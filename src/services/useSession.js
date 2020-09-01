import { reactive, computed, watch } from '@vue/composition-api'
import axios from './axios'
import { router } from '../boot/router'
const jwtSecret = 'wopidom.front'
const state = reactive({
  loading: false,
  apiToken: window.localStorage.getItem(jwtSecret),
  user: undefined
})
export const setApiToken = (value) => {
  state.apiToken = value
  window.localStorage.setItem(jwtSecret, value)
}
export const getApiToken = (value) => state.apiToken
const useSession = () => {
  const user = computed(() => state.user)
  const apiToken = computed(() => state.apiToken)
  const loggedIn = computed(() => Boolean(state.user))
  let loggedInHandle = () => false
  const onLoggedInChange = (cb) => { loggedInHandle = cb }
  const setUser = (data) => {
    state.user = data
  }
  const logout = () => {
    setApiToken(undefined)
    setUser(undefined)
    router.push('/login')
    // dispatch('setHijoActivo', undefined);
  }
  const login = async (_user) => {
    if (loggedIn.value) return loggedIn.value
    const response = await axios.post('/slot/auth', _user)
    if (!response) throw Error('Error de conexión')
    if (response.status !== 200) return response
    setApiToken(response.headers.token)
    setUser(response.data)
    return response
  }
  const tryToLogin = async () => {
    try {
      const response = await axios({ method: 'get', url: '/slot/with-token', params: { token: apiToken.value } })
      setUser(response.data.user)
      return Boolean(response.data)
    } catch (error) {
      console.log('tryToLogin error', error)
      return false
    }
  }
  watch(() => Boolean(state.user), (loggendIn) => {
    loggedInHandle(loggendIn)
  }, { immediate: true })
  return {
    user,
    tryToLogin,
    login,
    logout,
    loggedIn,
    setApiToken,
    apiToken,
    onLoggedInChange
  }
}
export default useSession
