<template>
  <q-card class="my-card">
    <input autofocus ref='fileInput' type="file" accept="application/JSON" @change="fileChange($event)" class="hidden">
    <q-card-section class="q-mb-lg" style="text-align: center;">
      <div class="row">
        <div class="text-h6">
          <q-input v-model="language.languageCode" label="Language Code" />
        </div>
      </div>
      <div class="row">
        <div class="text-h6">
          <q-input readonly v-model="fileForUpload" @click="$refs.fileInput.click()"
                   label="JSON file" />
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="q-mt-lg" align="right">
      <q-btn flat @click="$refs.fileInput.click()" >Select JSON file</q-btn>
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
export default {
  props: {
    language: { type: Object }
  },
  setup (props, { emit }) {
    const { loggedIn } = useSession()
    const state = reactive({
      fileInput: undefined,
      fileForUpload: props.language.localizationUrl ?? 'Select a JSON file'
    })
    const fileChange = (event) => {
      state.fileForUpload = state.fileInput.files[0].name
    }
    const submit = () => {
      var files = state.fileInput.files
      emit('close', { language: props.language, files })
    }
    watch(() => loggedIn, async () => {
    }, { immediate: true })
    watch(() => props.language, () => {
      state.languageCopy = Object.assign({}, props.language)
    }, { inmediate: true })
    return { ...toRefs(state), fileChange, submit }
  }
}
</script>

<style>
</style>
