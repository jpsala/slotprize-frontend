/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import axios from 'axios'
// import router from '../router';
const local = document.location.hostname === 'localhost'
// || document.location.hostname === 'front.wopidom.homelinux.com';
let setApiToken
let apiToken
export const setApiTokenInAxiosService = (_setApiToken) => {
  setApiToken = _setApiToken
}
const getAxios = () => {
  console.log('Axios, solo una vez!')
  axios.defaults.baseURL = local ? 'http://localhost:8888/api'
    : 'http://wopidom.homelinux.com:8888/api'
  axios.interceptors.response.use((response) => {
    const endPoint = response.config.url.substring(response.config.url.lastIndexOf('/') + 1)
    console.log('endpoint %O %O response.data %O', endPoint, response, response.data)
    if (response.data && (response.data.jwt || response.headers.token)) {
      setApiToken(response.data.jwt || response.headers.token)
      apiToken = response.data.jwt || response.headers.token
    }
    return response
  }, (error) => {
    console.log('Error en axios.interceptors.response: ', error.message || error)
    // throw error;
    return Promise.reject(error)
  })

  axios.interceptors.request.use(
    async (config) => {
      if (config.url !== '/auth/local') config.headers.token = apiToken
      return config
    },
    (error) => Promise.reject(error)
  )

  axios.defaults.method = 'GET'
  return axios
}
const _axios = getAxios()
export default _axios
