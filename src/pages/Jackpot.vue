<template>
    <div class="q-pa-md row q-gutter-md justify-center">
      <q-card bordered class="my-card">
        <q-card-section class="bg-primary text-white" style="width: 400px">
          <div class="text-h6">Jackpot Data</div>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section>
          <q-list  bordered separator>
          <q-item>
            <q-item-section style="max-width: 120px">
              <q-input @input="submit" v-model="cycle" label="CYCLE" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section style="max-width: 120px">
              <q-input v-model="prize" label="PRIZE" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              Spin Count {{spinCount}}
              <q-linear-progress class="q-mt-sm q-mb-sm" size="25px" :value="progress" color="primary">
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="primary" :label="progressLabel" />
                </div>
              </q-linear-progress>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <!-- <q-btn flat>Action 1</q-btn> -->
        <q-btn @click="submit" flat>Submit</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
export default {
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      cycle: undefined,
      prize: undefined,
      spinCount: undefined,
      progressLabel: '',
      progress: computed(() => state.spinCount * 1 / state.cycle)
    })
    state.progressLabel = computed(() => {
      return (state.progress * 100).toFixed(2) + '%'
    })
    const submit = async () => {
      axios({
        method: 'post',
        url: '/slot/spin_data',
        data: {
          prize: state.prize,
          cycle: state.cycle
        }
      })
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/spin_data',
        method: 'get',
        params: {}
      })
      state.cycle = response.data.cycle
      state.prize = response.data.prize
      state.spinCount = response.data.spinCount
    }, { immediate: true })
    return { ...toRefs(state), submit }
  }
}
</script>

<style>

</style>
