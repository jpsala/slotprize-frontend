<template>
  <q-card class="my-card">
    <img ref="img" class="cursor-pointer" @click="$refs.imgInput.click()" style="border-radius: 20%"
          id="output_image" :src="symbol.textureUrl ? symbol.textureUrl : missingImage">
    <input ref='imgInput' type="file" accept="image/*" @change="imgChange($event)" class="hidden">
    <q-card-section class="q-mb-lg" style="text-align: center;">
      <div class="text-h6">
        <q-input v-model="symbol.paymentType" label="Payment Type" />
      </div>
    </q-card-section>
    <q-card-actions class="q-mt-lg" align="right">
      <q-btn flat @click="$refs.imgInput.click()" >Select Image</q-btn>
      <q-btn flat @click="$emit('cancel')">Cancel</q-btn>
      <q-btn flat @click="submit">Submit</q-btn>
    </q-card-actions>

  </q-card>

</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
// eslint-disable-next-line no-unused-vars
import axios from '../services/axios'
import { isNotebook } from 'src/helpers'
export default {
  props: {
    symbol: {
      type: Object
    }
  },

  setup (props, { emit }) {
    const { loggedIn } = useSession()
    const state = reactive({
      img: undefined,
      imgInput: undefined,
      reader: new FileReader(),
      missingImage: isNotebook() ? 'http://localhost/public/assets/img/missing.png' : 'http://wopidom.homelinux.com/public/assets/img/lapices.png'
    })
    const imgChange = (event) => {
      state.reader.onload = function () {
        state.img.src = state.reader.result
      }
      state.reader.readAsDataURL(event.target.files[0])
    }
    const submit = () => {
      var files = state.imgInput.files
      emit('close', { symbol: props.symbol, files })
    }
    watch(() => loggedIn, async () => {
      // const response = await axios({
      //   url: '/slot/endpoint',
      //   method: 'get',
      //   params: {}
      // })
      // console.log('response', response)
    }, { immediate: true })
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
    margin: 30px 80px 20px 80px
}
</style>
