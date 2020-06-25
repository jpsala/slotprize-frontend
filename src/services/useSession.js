import { reactive, computed } from '@vue/composition-api';
import axios from './axios';
import { router } from '../boot/router';

const jwtSecret = 'wopidom.front';
const state = reactive({
  loading: false,
  apiToken: window.localStorage.getItem(jwtSecret),
  user: undefined,
});
const useSocio = () => {
  const user = computed(() => state.user);
  const apiToken = computed(() => state.apiToken);
  const loggedIn = computed(() => Boolean(state.user));
  //   const loggedIn = computed(() => Boolean(state.user));
  const setApiToken = (value) => {
    state.apiToken = value;
    window.localStorage.setItem(jwtSecret, value);
  };
  const setUser = (data) => {
    state.user = data;
    console.log('detalle', state);
  };
  const logout = () => {
    setApiToken(undefined);
    setUser(undefined);
    router.push('/login');
    // dispatch('setHijoActivo', undefined);
  };
  const login = async (_user) => {
    if (loggedIn.value) return loggedIn.value;
    const response = await axios.post('/slot/auth', _user);
    if (!response) throw Error('Error de conexión');
    if (response.status !== 200) return response;
    setApiToken(response.headers.token);
    console.log('response.data', response.data);
    setUser(response.data);
    return response;
  };
  const tryToLogin = async () => {
    try {
      const response = await axios({ method: 'get', url: '/slot/with-token', params: { token: apiToken.value } });
      setUser(response.data);
      return Boolean(response.data);
    } catch (error) {
      console.log('detalle', error);
      return false;
    }
  };
  return {
    user,
    tryToLogin,
    login,
    logout,
    loggedIn,
    setApiToken,
    apiToken,
  };
};
export default useSocio;
