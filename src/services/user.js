import fetch from '@/lib/fetch';

export default {
  login({ login, password, wait = 0, saveCredentials = false } = {}) {
    return fetch('login', {
      method: 'post',
      body: JSON.stringify({
        grant_type: 'password',
        login,
        password,
        wait,
        saveCredentials,
      }),
    });
  },
};
