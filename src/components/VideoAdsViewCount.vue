<template>
<div class="q-pa-md row q-gutter-md justify-center">
      <q-card bordered class="ads-card">
        <!-- <q-card-section class="bg-primary text-white" style="width: 400px">
          <div class="text-h6">Providers</div>
        </q-card-section> -->

        <q-separator dark inset />
        <q-card-section>
          <q-markup-table flat square>
            <thead>
              <tr>
                <th class="text-left">Provider</th>
                <th class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item of adProviderData" :key="item.id"
                  class="cursor-pointer">
                <td class="text-left">{{item.adProvider}}</td>
                <td class="text-right">{{item.count}}</td>
              </tr>
            </tbody>
          </q-markup-table>
      </q-card-section>
        <q-card-section>
          <q-markup-table flat square>
            <thead>
              <tr>
                <th class="text-left">Delivery Type</th>
                <th class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item of deliveryTypeData" :key="item.id"
                  class="cursor-pointer">
                <td class="text-left">{{item.deliveryType}}</td>
                <td class="text-right">{{item.count}}</td>
              </tr>
            </tbody>
          </q-markup-table>
      </q-card-section>
      <q-card-section>
        <q-markup-table flat square>
            <thead>
              <tr>
                <th class="text-left">Total</th>
                <th class="text-right">{{total}}</th>
              </tr>
            </thead>
          </q-markup-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from '@vue/composition-api'
import axios from '../services/axios'
export default {
  props: {
    player: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      deliveryTypeData: [],
      adProviderData: [],
      total: 0
    })
    onMounted(async () => {
      const response = await axios({
        url: `/slot/Video_ads_view_count_for_crud?userId=${props.player.id}`,
        method: 'get',
        params: {}
      })
      state.adProviderData = response.data.adProviderData
      state.deliveryTypeData = response.data.deliveryTypeData
      state.total = response.data.totalData.count
      console.log('response', response)
    }, { immediate: true })
    return { ...toRefs(state) }
  }
}
</script>

<style>
.ads-card{
  min-width: 400px;
}
</style>
