import { reactive, computed } from 'vue';
import axios from 'axios';
import router from '../router';

const jwtSecret = 'iae.v2';
const state = reactive({
    loading: false,
    apiToken: window.localStorage.getItem(jwtSecret),
    user: undefined,
});
const useSocio = () => {
    const user = computed(() => state.user);
    const apiToken = computed(() => state.apiToken);
    const loggedIn = computed(() => Boolean(state.user));
    const setApiToken = (value) => {
        state.apiToken = value;
        window.localStorage.setItem(jwtSecret, value);
    };
    const setUser = (data) => {
        state.user = data;
    };
    const logout = () => {
        setApiToken(undefined);
        setUser(undefined);
        router.push('/login');
    // dispatch('setHijoActivo', undefined);
    };
    const login = async (_user) => {
        if (loggedIn.value) return true;
        const response = await axios({method: 'get', url: '/api/iae/login', params: _user });
        if (!response) throw Error('Error de conexión');
        if (response.status !== 200) return response;
        setApiToken(response.headers.token);
        setUser(response.data.user);
        return response;
    };
    const tryToLogin = async () => {
        try {
            const response = await axios({ method: 'get', url: '/api/iae/user', params: { token: apiToken.value } });
            setUser(response.data.user);
            return Boolean(response.data.user);
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
