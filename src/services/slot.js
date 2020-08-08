import axios from './axios'

export const getSymbols = async () => {
  const resp = await axios.get('/slot/symbols_for_crud')
  return resp.data
}
export const delItem = async (itemId, file = false) => {
  const resp = await axios.delete('/slot/item',
    { params: { itemId, file } })
  return resp.data
}
