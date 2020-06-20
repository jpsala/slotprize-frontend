<template>
  <q-page class="flex flex-center">
      <Symbols :items="reelsData.symbols" @del="delItem"/>
<!-- <pre>{{reelsData}}</pre> -->
  </q-page>
</template>

<script>
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import { onMounted, reactive, toRefs } from '@vue/composition-api';
import Symbols from '../components/Symbols';
import { getReels } from '../services/slot';

export default {
  components: { Symbols },
  setup() {
    const state = reactive({
      reelsData: [],
    });
    const delItem = (item) => {
      const idx = state.reelsData.symbols.findIndex((_symbol) => _symbol.id === item.id);
      state.reelsData.symbols.splice(idx, 1);
      for (const _reel of state.reelsData.reels) {
        const idxEnReel = _reel.symbols.findIndex((_symbol) => _symbol.id === item.id);
        _reel.symbols.splice(idxEnReel, 1);
      }
    };

    onMounted(async () => {
      state.reelsData = await getReels();
    });
    return {
      ...toRefs(state), delItem,
    };
  },
};
</script>
<style lang="scss">
    .items{
        height: calc(100vh - 40px);
    }
</style>
