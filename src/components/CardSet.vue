<template>
    <q-card flat bordered class="cards-card" v-if="modelCopy">
      <input
        ref="imgInput"
        type="file"
        accept="image/*"
        @change="imgChange($event)"
        class="hidden"
      >
      <img
        ref="img"
        class="cursor-pointer q-pa-sm"
        @click="()=>{editing ? $refs.imgInput.click():null}"
        style="border-radius: 5%; text-align: center; margin: auto; "
        id="image"
        :src="
          modelCopy.textureUrl
            ? modelCopy.machineSkinTextureUrl
            : missingImage
        "
      >
      <q-card-section>
        <div class="text-subtitle1 text-weight-regular text-uppercase">Title</div>
        <q-separator />
         <q-markup-table :bordered='false' flat>
          <tbody>
            <tr v-for="(item,index) of modelCopy.localizations" :key="index">
              <td style="width: 80px">{{item.languageCode}}</td>
              <td>
                <q-input :disable="!editing" class="col" v-model="item.text" :borderless="!editing" autogrow dense/>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-separator class="q-mb-lg" />

      <q-card-section class="q-pt-none">

      </q-card-section>

      <q-separator inset />
      <q-card-actions class="q-mt-lg" align="right" >
      <q-btn color="primary" v-if="!editing" @click="editing = !editing" >Edit</q-btn>
      <q-btn color="secondary" v-if="editing" @click="editing = !editing" >Cancel</q-btn>
      <q-btn color="primary" v-if="editing" @click="submit" >Submit</q-btn>
      </q-card-actions>
    </q-card>
</template>

<script>
import { reactive, toRefs, onMounted, watch } from '@vue/composition-api'
import clone from 'rfdc'
// import XXX from '../components/XXX'
export default {
// components: {},
  props: {
    cardSet: undefined,
    languages: undefined
  },
  setup (props, { emit }) {
    const state = reactive({
      fileForUpload: props.cardSet.textureUrl ?? 'Select a JSON file',
      imgInput: undefined,
      img: undefined,
      modelCopy: undefined,
      reader: new FileReader(),
      editing: false,
      missingImage:
      'https://assets.slotoprizes.tagadagames.com/img/missing.png'
    })
    state.reader.onload = function () {
      state.img.src = state.reader.result
    }
    const imgChange = (event) => {
      state.reader.readAsDataURL(event.target.files[0])
    }
    const submit = () => {
      var files = state.imgInput.files
      emit('submit', { cardSet: state.modelCopy, files })
    }
    onMounted(() => {
      state.modelCopy = clone()(props.cardSet)
    })
    watch(
      () => props.model,
      () => {
        state.modelCopy = clone()(props.cardSet)
      },
      { inmediate: true }
    )
    return { ...toRefs(state), imgChange, submit }
  }
}
</script>

<style lang="scss">
.cards-card{
  img {
    min-width: 200px;
    max-width: 400px;
    min-height: 200px;
    margin: auto;
    margin: 30px 80px 20px 80px;
  }
}
</style>
