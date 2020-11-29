<template>
  <q-card class="card-card" v-if="modelCopy">
    <input
      ref="imgTextureInput"
      type="file"
      accept="image/*"
      @change="imgTextureChange($event)"
      class="hidden"
    >
    <input
      ref="imgThumbInput"
      type="file"
      accept="image/*"
      @change="imgThumbChange($event)"
      class="hidden"
    >
    <div v-if="editing" class="thumb-label">Image</div>
    <img class="texture-img cursor-pointer" :src="modelCopy.textureUrl"
            @click="$refs.imgTextureInput.click()" ref="imgTexture" style="border-radius: 20%">
    <q-separator  />
    <div v-if="editing" class="thumb-label">Thumb image</div>
    <img v-if="editing" class="thumb-img cursor-pointer" :src="modelCopy.thumbUrl"
            @click="$refs.imgThumbInput.click()" ref="imgThumb" style="border-radius: 20%">

    <div class="thumb-label">Localization</div>
    <q-card-section>
      <q-markup-table v-if="isEditingThis" flat dense>
        <tbody>
          <tr v-for="(localization, index) of modelCopy.localizations" :key="index">
            <td>{{localization.languageCode}}</td>
            <td><q-input v-model="localization.text" /></td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-markup-table v-else dense :bordered='false' flat>
        <tbody>
          <tr v-for="(localization, index) of modelCopy.localizations" :key="index">
            <td style="width: 30px">{{localization.languageCode}}</td>
            <td style="width: 500px"><span class="text-bold">{{localization.text}}</span></td>
          </tr>
        </tbody>
      </q-markup-table>

    </q-card-section>
    <q-separator />
    <div class="thumb-label">Stars</div>
    <q-card-section class="q-pt-none">
    <q-rating v-model="modelCopy.stars" size="2em" color="green-5" icon="star" />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn outline v-show="!isEditingThis" :disable="editing !== undefined" label="Edit" color="primary" icon="edit" @click="edit(modelCopy)" />
      <q-btn outline v-show="isEditingThis" label="Cancel"  color="red-6" icon="cancel"  @click="cancel(modelCopy)"/>
      <q-btn outline v-show="isEditingThis" label="Submit" @click="submit(modelCopy)" color="primary" icon="check" />
    </q-card-actions>
  </q-card>
</template>
<script>
/*
  id: (...)
  localizations: (...)
  stars: (...)
  textureUrl: (...)
  thumbUrl: (...)
*/
import { reactive, toRefs, onMounted, watch, computed } from '@vue/composition-api'
import clone from 'rfdc'
import { alerta } from 'src/helpers'
import useGlobal from '../services/useGlobal'
const { showSpinner, hideSpinner } = useGlobal()
export default {
  props: {
    model: undefined,
    save: { type: Function, default: () => { console.log('Function not assigned') } },
    editing: undefined
  },
  setup (props, { emit }) {
    const state = reactive({
      modelCopy: undefined,
      imgTextureInput: undefined,
      imgTexture: undefined,
      imgThumbInput: undefined,
      imgThumb: undefined,
      readerTexture: new FileReader(),
      readerThumb: new FileReader(),
      missingImage: 'https://assets.slotoprizes.tagadagames.com/img/missing.png'
    })
    state.readerTexture.onload = function () {
      state.imgTexture.src = state.readerTexture.result
    }
    state.readerThumb.onload = function () {
      state.imgThumb.src = state.readerThumb.result
    }
    const imgTextureChange = (event) => {
      state.readerTexture.readAsDataURL(event.target.files[0])
    }
    const imgThumbChange = (event) => {
      state.readerThumb.readAsDataURL(event.target.files[0])
    }
    const edit = (card) => {
      state.backup = clone()(state.modelCopy)
      emit('update:cardEditing', card)
    }
    const cancel = (card) => {
      state.modelCopy = clone()(state.backup)
      emit('update:cardEditing', undefined)
    }
    const submit = async (card) => {
      showSpinner()
      try {
        const textureFiles = state.imgTextureInput?.files
        const thumbFiles = state.imgThumbInput?.files
        console.log('textureFiles, thumbFiles', textureFiles, thumbFiles)
        const result = await props.save(card, textureFiles, thumbFiles)
        console.log('result', result)
        state.modelCopy = clone()(result.data)
        emit('update:cardEditing', undefined)
      } catch (err) {
        hideSpinner()
        await alerta('Error saving data', err)
        console.log('error', err)
      } finally {
        hideSpinner()
      }
    }
    const saved = () => {
      console.log('saved')
    }
    const isEditingThis = computed(() => {
      return props.editing?.id === props.model?.id
    })
    onMounted(() => {
      state.modelCopy = clone()(props.model)
    })
    watch(
      () => props.model,
      () => {
        state.modelCopy = clone()(props.model)
      },
      { inmediate: true }
    )
    return { ...toRefs(state), edit, cancel, submit, saved, isEditingThis, imgTextureChange, imgThumbChange }
  }
}
</script>
<style lang="scss">
  .card-card{
    width: 300px;
    margin-right: 15px;
    .texture-img{
      max-width: 300px;
    };
    .thumb-label{
      border-radius: 5px;
      width: 100%;
      margin-top: 10px;
      padding: 5px;
      background-color: $grey-3;
    }
    .thumb-img{
      max-width: 100px;
    };
  }
</style>
