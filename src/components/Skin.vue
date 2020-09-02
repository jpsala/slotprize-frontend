<template>
  <q-card class="my-card" v-if="modelCopy">
    <input ref='imgInput' type="file" accept="image/*" @change="imgChange($event)" class="hidden">
    <q-card-section class="q-mb-lg" style="text-align: center;">
      <div class="row">
        <div class="text-h6">
          <q-input v-model="modelCopy.name" label="Name" />
          <div class="row">
            <q-input class="col-4" v-model="modelCopy.machineBgColor" label="Background Color" />
          </div>
          <img ref="img" class="cursor-pointer" @click="$refs.imgInput.click()" style="border-radius: 20%"
               id="output_image1" :src="modelCopy.machineSkinTextureUrl ? modelCopy.machineSkinTextureUrl : missingImage">

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
    model: { type: Object }
  },
  setup (props, { emit }) {
    const state = reactive({
      modelCopy: undefined,
      imgInput: undefined,
      fileForUpload: props.model.machineSkinTextureUrl ?? 'Select a JSON file',
      img: undefined,
      reader: new FileReader(),
      missingImage: 'http://wopidom.homelinux.com/public/assets/img/missing.png'
    })
    state.reader.onload = function () {
      state.img.src = state.reader.result
    }
    const imgChange = (event) => {
      state.reader.readAsDataURL(event.target.files[0])
    }
    const submit = () => {
      var files = state.imgInput.files
      emit('close', { skin: state.modelCopy, files })
    }
    onMounted(() => {
      state.modelCopy = clone()(props.model)
    })
    watch(() => props.model, () => {
      state.modelCopy = clone()(props.model)
    }, { inmediate: true })
    return { ...toRefs(state), imgChange, submit }
  }
}
</script>

<style>
#output_image1{
    width: 200px;
    height: 200px;
    margin: auto;
    margin: 30px 80px 20px 80px;
}
</style>
