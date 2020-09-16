<template>
  <q-card class="my-card" v-if="countryCopy">
    <input autofocus ref='imgInput' type="file" accept="image/*" @change="imgChange($event)" class="hidden">
    <q-card-section class="q-mb-lg" style="text-align: center;">
      <div class="row">
        <div class="text-h6">
          <q-input v-model="countryCopy.name" label="Name" />
          <div class="row">
            <q-input class="col" v-model="countryCopy.currency" label="Currency" />
            <q-input class="col" v-model="countryCopy.phonePrefix" label="Phone Prefix" />
          </div>
          <!-- <pre>{{languages}}</pre> -->
          <q-select label="Language" emit-value map-options
                    stack-label v-model="countryCopy.languageId" :options="languages"
                    option-value="id" option-label="languageCode"/>
          <img ref="img" class="cursor-pointer" @click="$refs.imgInput.click()" style="border-radius: 20%"
               id="output_image" :src="countryCopy.textureUrl ? countryCopy.textureUrl : missingImage">

        </div>
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
import { reactive, toRefs, watch, onMounted } from '@vue/composition-api'
import clone from 'rfdc'

export default {
  props: {
    country: { type: Object },
    languages: { type: Array }
  },
  setup (props, { emit }) {
    const state = reactive({
      countryCopy: undefined,
      imgInput: undefined,
      fileForUpload: props.country.countryUrl ?? 'Select a JSON file',
      img: undefined,
      reader: new FileReader(),
      missingImage: 'http://wopi.homelinux.com/public/assets/img/missing.png'
    })
    state.reader.onload = function () {
      state.img.src = state.reader.result
    }
    const imgChange = (event) => {
      state.reader.readAsDataURL(event.target.files[0])
    }
    const submit = () => {
      var files = state.imgInput.files
      emit('close', { country: state.countryCopy, files })
    }
    onMounted(() => {
      state.countryCopy = clone()(props.country)
    })
    watch(() => props.country, () => {
      state.countryCopy = clone()(props.country)
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
