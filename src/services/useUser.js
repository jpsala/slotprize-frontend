/* eslint-disable no-return-assign */
/* eslint-disable no-mixed-operators */
import { reactive, toRefs, readonly } from 'vue';
import axios from 'axios';

let onFilterAppliedFN = () => {};
let onLoadedFN = () => {};
export default () => {
    const state = reactive({
        loaded: false,
        loading: false,
        usuario: undefined,
        usuarios: [],
        usuariosFiltered: [],
        filter: '',
    });
    const setUsuario = (value) => {
        state.usuario = value;
    };
    const reset = () => {
        state.filter = '';
        state.usuariosFiltered = [];
        state.usuario = undefined;
    };
    const onFilterApplied = (fn) => onFilterAppliedFN = fn;
    const onDataLoaded = (fn) => onLoadedFN = fn;
    const setFilter = (value, { all = false } = {}) => {
        state.filter = value;
        if (!value && all) {
            state.usuariosFiltered = state.usuarios;
        } else if (!value) {
            state.usuariosFiltered = [];
            return;
        }
        if (value.length < 3) return;
        state.usuariosFiltered = state.usuarios.filter((u) => {
            if (u.nombre && u.nombre.toUpperCase().includes(value.toUpperCase())
            || (u.apellido && u.apellido.toUpperCase().includes(value.toUpperCase()))
            || (u.email && u.email.toUpperCase().includes(value.toUpperCase()))
            || (u.documento && u.documento.toUpperCase().includes(value.toUpperCase()))
            || (u.login && u.login.toUpperCase().includes(value.toUpperCase()))) { return true; }
            return false;
        });
        onFilterAppliedFN();
    };
    const borraUsuario = async (value) => {
        console.log('value', value);
        const resp = await axios({ method: 'delete', url: '/api/iae/user', params: { id: value.id } });
        if (resp.data.error) {
            alert(resp.data.error);
            return false;
        }
        // state.usuario = value;
        const idx = state.usuarios.findIndex((_u) => _u.id === value.id);
        if (idx >= 0) state.usuarios.splice(idx, 1);
        return true;
        // setFilter(state.filter);
    };
    const grabaUsuario = async (value) => {
        state.loading = true;
        await axios.post('/api/iae/user', value);
        state.loading = false;
        const idx = state.usuarios.findIndex((_u) => _u.id === value.id);
        // state.usuario = value;
        if (idx >= 0) state.usuarios[idx] = value;
        // setFilter(state.filter);
    };
    const fetch = async () => {
        if (state.usuarios.length > 0) return;
        try {
            state.loading = true;
            const response = await axios({ url: '/api/iae/user/users' });
            state.loading = false;
            if (!response) throw Error('Error de conexión');
            state.usuarios = response.data;
            state.loaded = true;
            onLoadedFN();
        } catch (error) {
            alert(error);
        }
    };
    console.log('hola');
    fetch();
    return {
        ...toRefs(readonly(state)),
        reset,
        setUsuario,
        setFilter,
        onFilterApplied,
        onDataLoaded,
        grabaUsuario,
        borraUsuario,
    };
};
