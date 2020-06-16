/* eslint-disable import/prefer-default-export */
import axios from './axios';

export const getUsersByTerm = async (term) => {
    console.log('term', term);
    const resp = await axios.get(`/api/iae/user/usersByTerm?term=${term}`);
    console.log('resp', resp);
    return resp.data.map((u) => {
    // eslint-disable-next-line no-param-reassign
        u.nombreCompleto = `${u.apellido}, ${u.nombre}`;
        return u;
    });
};
export const getUsers = async () => {
    const resp = await axios.get('/api/iae/user/users');
    return resp.data.map((u) => {
    // eslint-disable-next-line no-param-reassign
        u.nombreCompleto = `${u.apellido}, ${u.nombre}`;
        return u;
    });
};

export const getUser = async (id) => {
    const resp = await axios.get(`/api/iae/user/userByID?id=${id}`);
    console.log('resp', resp.data);
    if (resp.data) resp.data.nombreCompleto = `${resp.data.nombre}, ${resp.data.apellido}`;
    return resp.data;
};
