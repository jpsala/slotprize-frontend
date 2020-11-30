<template>
  <q-card class="card-card q-mb-md" v-if="modelCopy">
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
    <div v-if="editing" class="texture-label">Thumbnail</div>
    <img :class="'thumb-img ' + (isEditingThis ? 'cursor-pointer':'')" :src="modelCopy.thumbUrl"
          @click="isEditingThis?$refs.imgThumbInput.click():null" ref="imgThumb" style="border-radius: 20%">
    <q-separator  />

    <!-- <div  class="texture-label">Thumb image</div> -->
    <q-expansion-item
      class="bg-grey-3"
      dense
      dark
      switch-toggle-side
      label="Main Image"
      :value="false"
      header-class="text-primary"
    >
    <img  :class="'texture-img ' + (isEditingThis ? 'cursor-pointer':'')" :src="modelCopy.textureUrl"
            @click="isEditingThis?$refs.imgTextureInput.click():null" ref="imgTexture" style="border-radius: 20%">
    </q-expansion-item>
    <div class="texture-label">Localization</div>
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
    <div class="texture-label">Stars</div>
    <q-card-section class="q-pt-none">
    <q-rating :disable="!editing" v-model="modelCopy.stars" size="2em" color="yellow-7" icon="star" />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn outline v-show="!isEditingThis" :disable="editing !== undefined" label="Delete" color="red-4" icon="cancel" @click="deleteCard(modelCopy)" />
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
import { alerta, confirma } from 'src/helpers'
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
    const deleteCard = async (card) => {
      if (await confirma('Are you sure you want to delete this card?')) {
        emit('delete-card', card)
      }
    }
    const edit = (card) => {
      state.backup = clone()(state.modelCopy)
      emit('update:cardEditing', card)
    }
    const cancel = (card) => {
      state.modelCopy = clone()(state.backup)
      emit('cancel-card-add', card)
      emit('update:cardEditing', undefined)
    }
    const submit = async (card) => {
      showSpinner()
      try {
        const textureFiles = state.imgTextureInput?.files
        const thumbFiles = state.imgThumbInput?.files
        console.log('card submit textureFiles, thumbFiles', textureFiles, thumbFiles)
        const result = await props.save(card, textureFiles, thumbFiles)
        console.log('card submit result', result)
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
    const isEditingThis = computed(() => {
      return props.editing?.id === props.model?.id
    })
    const cloneModel = () => {
      state.modelCopy = clone()(props.model)
      if (!state.modelCopy.textureUrl) state.modelCopy.textureUrl = 'https://assets.slotoprizes.tagadagames.com/img/missing.png'
      if (!state.modelCopy.thumbUrl) state.modelCopy.thumbUrl = 'https://assets.slotoprizes.tagadagames.com/img/missing.png'
    }

    onMounted(() => {
      console.log('onMounted props.model', props.model)
      cloneModel()
    })
    watch(
      () => props.model,
      () => {
        console.log('props.model changed', props.model)
        cloneModel()
      },
      { inmediate: true }
    )
    return { ...toRefs(state), edit, cancel, submit, isEditingThis, imgTextureChange, imgThumbChange, deleteCard }
  }
}
</script>
<style lang="scss">
  .card-card{
    width: 300px;
    margin-right: 15px;
    .q-expansion-item__content{
      background-color: white;
      text-align: center;
      display: flex;
    }

    .texture-label{
      border-radius: 5px;
      width: 100%;
      margin-top: 10px;
      padding: 5px;
      background-color: $grey-3;
    }
    .texture-img{
      padding: 10px;
      max-width: 250px;
      margin: auto;
    };
    .thumb-img{
      padding: 10px;
      max-width: 150px;
      margin: auto;
    };
  }
</style>
