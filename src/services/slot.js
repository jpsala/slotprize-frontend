import axios from './axios';

export const getReels = async () => {
  const resp = await axios.get('/slot/symbols_in_db');
  return resp.data;
};
export const delItem = async (itemId, file = false) => {
  const resp = await axios.delete('/slot/item',
    { params: { itemId, file } });
  return resp.data;
};
