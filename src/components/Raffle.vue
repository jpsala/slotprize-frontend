<template>
<q-dialog :value="raffleCopy && raffleCopy !== undefined" persistent transition-show="scale" transition-hide="scale">
  <q-card class="raffle-card"  v-if="raffleCopy">
          <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="info" label="Information" />
          <q-tab name="raffleHistory" label="Raffle History" />

        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="info">
            <div class="row raffle-top">
              <img ref="imgRef" class="cursor-pointer col raffle-img" @click="$refs.inputImgRef.click()"
                   :src="raffleCopy.textureUrl ? raffleCopy.textureUrl : missingImage"/>
              <input ref='inputImgRef' type="file" accept="image/*" @change="imgChange($event)" class="hidden">
            <div class="col col-right">
              <!-- <h4 class="raffle-title">Raffle</h4> -->
                <div class="q-pa-md" style="max-width: 300px">
                  <!-- {{raffleCopy.closingDate}} -->
                  <date-picker v-model="raffleCopy.liveDate" label="Live Date" />
                  <date-picker v-model="raffleCopy.closingDate" label="Closing Date"/>
                  <q-input v-model="raffleCopy.price" label="Number Price" />
                  <q-select class="col-6" label="Status"
                            stack-label v-model="raffleCopy.state" :options="['won', 'delivered', 'closed']"
                            option-value="id" option-label="name"
                            :disable="!['won', 'delivered', 'closed', 'nopurchase'].includes(raffleCopy.state)"/>
                </div>
            </div>
            </div>
            <q-card-section class="q-mb-lg" style="text-align: center;">
              <div v-for="language in raffleCopy.localization" :key="language.id">
                <div class="row">
                    <div class='col lang-title'>
                      <span>{{language.language_code}}</span>
                    </div>
                  <div class="col lang-input">
                    <q-input v-model="language.name" label="Title" />
                  </div>
                  <div class="col">
                    <q-input v-model="language.description" label="description" />
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-actions class="q-mt-lg" align="right">
              <q-btn flat @click="$refs.inputImgRef.click()" >Select Image</q-btn>
              <q-btn flat @click="cancel">Cancel</q-btn>
              <q-btn flat @click="submit">Submit</q-btn>
            </q-card-actions>
          </q-tab-panel>
        </q-tab-panels>
  </q-card>
</q-dialog>
</template>
<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import { klona } from 'klona/json'
import DatePicker from '../components/DatePicker.vue'
export default {
  components: { DatePicker },
  props: {
    raffle: {
      type: Object,
      default: undefined
    },
    languages: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    const state = reactive({
      raffleCopy: undefined,
      reader: new FileReader(),
      inputImgRef: undefined,
      imgRef: undefined,
      tab: 'info',
      missingImage: 'https://slotoprizes.tagadagames.com/public/assets/img/missing.png'
    })
    const cancel = () => {
      emit('close')
      state.raffleCopy = undefined
    }
    const imgChange = (event) => {
      state.reader.onload = function () {
        state.imgRef.src = state.reader.result
      }
      state.reader.readAsDataURL(event.target.files[0])
    }
    const statusChange = (value) => {
      state.eventClone.skin = value
      state.key += 1
    }

    const submit = () => {
      var files = state.inputImgRef.files
      emit('close', { raffle: state.raffleCopy, files })
      // state.raffleCopy = undefined
    }
    watch(() => props.raffle, raffle => { state.raffleCopy = klona(raffle) }, { deep: true })
    return { ...toRefs(state), close, imgChange, submit, cancel, statusChange }
  }
}
</script>
<style lang="scss">
.raffle-card{
  width: 900px !important;
  max-width: 80vw !important;
  .raffle-top{
    .raffle-title{
      align-self: flex-start;
      justify-self: left;
      margin: 10px 0 0 0;
    }
  }
  .raffle-img{
    margin: 10px 0 10px 10px;
    max-width: 50vw!important;
    width: 250px!important;
  }
  .lang-input{
    max-width: 250px !important;
  }
  .lang-title{
    max-width: 80px !important;;
    align-self: center;
    &span{
      margin-right: 20px;
    }
  }
}
</style>
