<template>
  <div class="q-pa-md">

    <div class="q-gutter-y-md" style="max-width: 100%">
      <h3 class="q-ml-xl q-pl-xl" style="margin-bottom: 0; padding-bottom: 0">Legals</h3>
      <q-separator />
      <h4 class="bg-red-8 text-white q-pa-lg" style="border-radius: 10px" v-if="missingLocalizations">There are missing localizations</h4>
      <q-option-group v-model="panel" inline :options="items" />
      <q-tab-panels v-model="panel" animated >
        <q-tab-panel v-for="tab of items" :name="tab.value" :key="tab.value">
          <div class="text-subtitle1 text-weight-regular text-uppercase">{{tab.label}}</div>
          <q-separator :spaced="true"/>
          <div v-for="rule in tab.localizations" :key="rule.languageId" class="shadow-2 rounded-borders q-mt-md">
              <div class="bg-grey-8 q-pa-sm text-white text-subtitle1 text-weight-regular text-uppercase">
                {{rule.languageCode}}
              </div>
              <q-separator />
              <div class="q-pa-md">
                <q-input class="localization-input" type="textarea" v-model="rule.text" autogrow style="font-size: 120%"/>
              </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <!-- <q-separator /> -->
      <div class="row">
      <q-checkbox class="float-right q-mb-lg" size="xl" style="font-size:160%" v-model="dontEnforce" label="dont enforce agreement" />
      <q-separator style="clear: both"/>
      </div>
      <div class="row q-mt-md float-right q-mt-xl">
        <q-btn color="primary" @click="submit">
          Submit
        </q-btn>
      </div>
  </div>
    </div>
</template>
<script>
import axios from '../services/axios'
import useGlobal from '../services/useGlobal'
import useSession from '../services/useSession'
import { reactive, toRefs, watch, onMounted, nextTick, computed } from '@vue/composition-api'
import { alerta } from 'src/helpers'
export default {
  setup () {
    console.clear()
    const { showSpinner, hideSpinner } = useGlobal()
    const { loggedIn } = useSession()
    // const { isDevEnv } = useGlobal()
    let downloadingData = false
    const state = reactive({
      panel: '',
      items: [],
      dontEnforce: false,
      missingLocalizations: computed(() => {
        for (const item of state.items) {
          for (const localization of item.localizations) {
            if (localization.text === '') return true
          }
        }
        return false
      })
    })
    const submit = async () => {
      showSpinner()
      const resp = await axios.post('/slot/legals_for_crud', { items: state.items, dontEnforce: state.dontEnforce })
      hideSpinner()
      if (Number(resp.data) > 0) await alerta('Saved', `${resp.data} Profiles where updated`)
      console.log('resp', resp)
    }
    const getData = async () => {
      if (state.items.length > 0 || downloadingData) return
      try {
        downloadingData = true
        showSpinner()
        const resp = await axios.get('/slot/legals_for_crud')
        state.items = resp.data
        state.panel = state.items[0].value
        nextTick(() => { document.querySelector('.localization-input').focus() })
      } finally {
        downloadingData = false
        hideSpinner()
      }
    }
    onMounted(getData)
    watch(() => loggedIn.value, async (v) => {
      console.log('watch')
      await getData()
    }, { inmediate: true })
    return { ...toRefs(state), submit }
  }
}
</script>
