<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Languages</h3>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Language Code</th>
          <th class="text-left">Localization URL</th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row) in rows" :key="row.id" @click="selectRow(row, $event)" class="cursor-pointer">
          <td class="text-left">{{row.languageCode}}</td>
          <td class="text-left">{{row.localizationUrl}}</td>
          <td class="text-right">
            <q-icon @click="delLanguage(row.id)" class="remove" name="remove_circle_outline"
                    size="30px" color="red-5" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  <LanguageDialog :language="selected" @close="languageClose" @cancel="languageCancel"/>
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-btn :disable="selected !== undefined" @click="addLanguage"
              fab icon="add" color="red-6" />
    </q-page-sticky>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import LanguageDialog from '../components/LanguageDialog'
import { alerta, confirma } from 'src/helpers'

export default {
  components: { LanguageDialog },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      selected: undefined,
      rows: undefined
    })
    const selectRow = async (language, event) => {
      if (event.target.tagName !== 'TD') return
      state.selected = language
    }
    const delLanguage = async (languageId) => {
      if (!(await confirma('Sure?'))) return
      try {
        const response = await axios({
          method: 'delete',
          url: 'slot/language_for_crud',
          params: { languageId }
        })
        if (response.data !== 1) {
          await alerta('Error deleting language')
        }
        console.log('response', response)
        const idxLanguageForDeletion = state.rows.findIndex(lang => lang.id === languageId)
        state.rows.splice(idxLanguageForDeletion, 1)
      } catch (error) {
        await alerta('Error deleting language', error)
      }
    }
    const languageClose = async (data) => {
      console.log('data', data)
      const { language, files } = data
      var fd = new FormData()
      fd.append('id', language.id)
      fd.append('language_code', language.languageCode)
      fd.append('localization_url', language.localizationUrl)
      fd.append('isNew', language.isNew)
      if (files.length > 0) { fd.append('file', files[0]) }
      const axiosAnt = axios.defaults.headers.post['Content-Type']
      try {
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
        const response = await axios({
          method: 'post',
          url: 'slot/language_for_crud',
          data: fd,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        axios.defaults.headers.post['Content-Type'] = axiosAnt
        const languageFromDb = response.data
        state.selected = undefined
        if (language.isNew) state.rows.push(languageFromDb)
        else state.selected = languageFromDb
      } catch (error) {
        await alerta('Error submiting language', error)
      }
    }
    const addLanguage = () => {
      state.selected = {
        id: -1, isNew: true
      }
    }
    const languageCancel = () => {
      state.selected = undefined
    }
    watch(() => loggedIn, async () => {
      const response = await axios({ url: '/slot/languages_for_crud', method: 'get' })
      state.rows = response.data
      console.log('response', response)
    }, { immediate: true })
    return { ...toRefs(state), languageClose, languageCancel, addLanguage, delLanguage, selectRow }
  }
}
</script>

<style>
  tr .remove{
    position:absolute; right: 0px; top: 8px;
    display: none;
  }
  tr:hover .remove {
    display: block;
    cursor: pointer;
  }
</style>
