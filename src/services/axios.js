/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import axios from 'axios'

import useGlobal from '../services/useGlobal'
import { setApiToken, getApiToken } from './useSession'
// import router from '../router';
const local = document.location.hostname === 'localhost'
// || document.location.hostname === 'front.wopi.homelinux.com';
let apiToken
const getAxios = () => {
  const { startLoading, stopLoading, isDev } = useGlobal()
  console.log('Axios, solo una vez!')
  console.log('isDev', isDev.value)
  if (isDev.value) axios.defaults.baseURL = 'http://wopi.homelinux.com:8888/api'
  else {
    axios.defaults.baseURL = local ? 'http://localhost:8888/api'
      : 'https://slotoprizes.tagadagames.com:3000/api'
  }
  axios.interceptors.response.use((response) => {
    setTimeout(() => {
      stopLoading()
    }, 500)
    const endPoint = response.config.url.substring(response.config.url.lastIndexOf('/') + 1)
    console.log('endpoint %O %O response.data %O', endPoint, response, response.data)
    if (response.data && (response.data.jwt || response.headers.token)) {
      apiToken = response.data.jwt || response.headers.token
      setApiToken(apiToken)
    }
    return response
  }, (error) => {
    stopLoading()
    console.log('error', error)
    let msg = error.response?.data?.message
    if (!msg) msg = error.message
    if (!msg) msg = error
    console.log('Error en axios.interceptors.response: ', msg)
    // throw error;
    return Promise.reject(msg)
  })

  axios.interceptors.request.use(
    async (config) => {
      startLoading()
      if (!apiToken) apiToken = getApiToken()
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
