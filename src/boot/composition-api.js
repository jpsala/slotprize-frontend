// composition-api.js
console.log('coposition-api');
import VueCompositionApi from '@vue/composition-api';
import { boot } from 'quasar/wrappers';

export default boot(({ Vue }) => {
  Vue.use(VueCompositionApi);
});
