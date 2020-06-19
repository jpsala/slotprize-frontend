<template>
  <q-page class="flex flex-center">
      <q-banner class="bg-grey-3">
      Reels Setup - Soon
    </q-banner>
<!-- <pre>{{reels}}</pre> -->
  </q-page>
</template>

<script>
import { onMounted, reactive, toRefs } from '@vue/composition-api';
// import Symbols from '../components/Symbols';
import { getReels } from '../services/slot';
// import useSession from '../services/useSession';

export default {
//   components: { Symbols },
  setup() {
    const state = reactive({
      reels: [],
    });
    // const { loggedIn } = useSession();
    onMounted(async () => {
      state.reels = await getReels();
      console.log('mounted', state.reels);
    });
    return { ...toRefs(state) };
  },
};
</script>
