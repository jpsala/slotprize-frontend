/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
// import router from '../router';

const local = document.location.hostname === 'localhost';
const getAxios = () => {
  console.log('detalle');
  console.log('Axios, solo una vez!');
  axios.defaults.baseURL = local ? 'http://localhost:8888/api'
    : 'http://iae.dyndns.org:8888';
  axios.interceptors.response.use((response) => {
    console.log('response', response);
    const endPoint = response.config.url.substring(response.config.url.lastIndexOf('/') + 1);
    console.log('endpoint %O %O response.data %O', endPoint, response, response.data);
    if (response.data && response.data.jwt) {
    //   setApiToken(response.data.jwt);
    }
    return response;
  }, (error) => {
    console.log('Error en axios.interceptors.response: ', error.message || error);
    // throw error;
    return Promise.reject(error);
  });

  axios.interceptors.request.use(
    async (config) => {
      // console.log('router', config);
      // const token = `Bearer ${apiToken.value}`;
      // console.log('token', token);
      // eslint-disable-next-line no-param-reassign
    //   if (config.url !== '/auth/local') config.headers.token = apiToken.value;
      // if (config.url !== '/auth/local') config.headers.Authorization = token;
      return config;
    },
    (error) => Promise.reject(error),
  );

  axios.defaults.method = 'GET';
  return axios;
};
const _axios = getAxios();
// export const setApiTokenInAxios = (_setApiToken => { setApiToken = _setApiToken };
export default _axios;
