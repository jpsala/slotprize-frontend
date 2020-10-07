<template>
  <q-card class="my-card">
    <img
      ref="img"
      class="cursor-pointer"
      @click="$refs.imgInput.click()"
      style="border-radius: 20%"
      id="output_image"
      :src="symbolCopy.textureUrl ? symbolCopy.textureUrl : missingImage"
    >
    <input
      autofocus
      ref="imgInput"
      type="file"
      accept="image/*"
      @change="imgChange($event)"
      class="hidden"
    >
    <q-card-section
      class="q-mb-lg"
      style="text-align: center;"
    >
      <div class="row">
        <div class="text-h6 col">
          <q-input
            v-model="symbolCopy.symbolName"
            label="Symbol NAme"
          />
        </div>
        <div class="text-h6 col-5">
          <q-select
            label="Payment Type"
            stack-label
            v-model="symbolCopy.paymentType"
            :options="paymentOptions"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions
      class="q-mt-lg"
      align="right"
    >
      <q-btn
        flat
        @click="$refs.imgInput.click()"
      >
        Select Image
      </q-btn>
      <q-btn
        flat
        @click="$emit('cancel')"
      >
        Cancel
      </q-btn>
      <q-btn
        flat
        @click="submit"
      >
        Submit
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
// eslint-disable-next-line no-unused-vars
import axios from '../services/axios'
export default {
  props: {
    symbol: {
      type: Object
    }
  },
  setup (props, { emit }) {
    const state = reactive({
      img: undefined,
      symbolCopy: Object.assign({}, props.symbol),
      imgInput: undefined,
      reader: new FileReader(),
      paymentOptions: ['coin', 'spin', 'ticket', 'jackpot'],
      missingImage: 'https://slotoprizes.tagadagames.com/public/assets/img/missing.png'
    })
    const imgChange = (event) => {
      state.reader.onload = function () {
        state.img.src = state.reader.result
      }
      state.reader.readAsDataURL(event.target.files[0])
    }
    const submit = () => {
      var files = state.imgInput.files
      emit('close', { symbol: state.symbolCopy, files })
    }
    watch(() => props.symbol, () => {
      state.symbolCopy = Object.assign({}, props.symbol)
    }, { inmediate: true })
    return { ...toRefs(state), imgChange, submit }
  }
}
</script>

<style>
#output_image{
    width: 200px;
    height: 200px;
    margin: auto;
    margin: 30px 80px 20px 80px;
}
</style>
