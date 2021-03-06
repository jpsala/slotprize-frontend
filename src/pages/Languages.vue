<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <div class="text-subtitle1 text-weight-regular text-uppercase">Localization</div>
    <div>
      <q-input v-model="localizationJsonUrl" type="textarea" autogrow hint="Replace the language code with <languageCode> and the environment with <environment>"/>
    </div>
    <div v-if="isDevEnv">
      <q-input v-model="localizationSpreadsheetUrlDev" type="textarea" autogrow hint="spreadsheet url for DEV"/>
    </div>
    <div v-else class="">
      <q-input v-model="localizationSpreadsheetUrlLive" type="textarea" autogrow hint="spreadsheet url for LIVE"/>
    </div>
    <div class="row q-mt-md q-mb-xl float-right">
      <q-btn color="primary" @click="submitSettings">
        Submit
      </q-btn>
    </div>

    <q-separator style="clear: both" class="q-mt-xl" spaced="30px"/>

    <div class="q-mt-md text-subtitle1 text-weight-regular text-uppercase">Languages</div>
    <q-markup-table class="">
      <thead>
        <tr>
          <th class="text-left">
            Language Code
          </th>
          <th class="text-left">
            Last JSON Update
          </th>
          <th class="text-center">
            Image
          </th>
          <th class="text-left">

          </th>
          <th class="is-default">

          </th>
          <th class="text-left" />
          <th class="text-left" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row) in rows"
          :key="row.id"
          @click="selectRow(row, $event)"
          class="cursor-pointer"
        >
          <td class="text-left language-code-td">
            {{ row.languageCode }}
          </td>
          <td class="text-left">
            {{ row.updatedAt }}
          </td>
          <td class="text-center img-td">
            <img :src="row.textureUrl">
          </td>
          <td class="text-left active-td">
            <q-chip v-if="row.deleted === 1" color="white" style="max-width: 90px" text-color="green-8" icon="cancel">Inactive</q-chip>
            <q-chip v-else color="white" style="max-width: 90px" text-color="green-8" icon="check">Active</q-chip>
          </td>
          <td v-if="row.isDefault === 1" class="is-default text-primary text-subtitle1 text-h6" style="font-size: 110%; font-weight: bold" >
            <q-chip color="white" square style="max-width: 90px" text-color="green" icon="check">Default</q-chip>
          </td>
          <td class="is-default" v-else><q-btn push size="sm"  color="grey-7" @click="makeDefault(row)">Make default</q-btn></td>
          <td class="is-default"><q-btn push size="sm"  color="grey-7" @click="refreshJSON(row)">Update JSON</q-btn></td>
          <td class="text-right dot-menu-td">
            <q-btn class="dot-menu" color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section @click="() => delLanguage(row)">
                        Remove Language
                      </q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section @click="toggleLanguage(row)">
                        {{row.deleted === 1 ? 'Activate Language' : 'Deactivate Language'}}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <LanguageDialog
      :language="selected"
      @close="languageCloseDialog"
      @cancel="languageCancel"
    />
    <q-page-sticky position="top-right" :offset="[18, 18]" >
      <q-btn :disable="selected !== undefined" @click="openJson" label="Open Localization Spreadsheet" icon="refresh" color="green-6"/>
    </q-page-sticky>
    <q-page-sticky position="top-right" :offset="[28, 340]">
      <q-btn :disable="selected !== undefined" @click="addLanguage" fab icon="add" color="red-6" />
    </q-page-sticky>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import LanguageDialog from '../components/LanguageDialog'
import { alerta, confirma, notify } from 'src/helpers'
import useGlobal from '../services/useGlobal'
import { Notify } from 'quasar'

const { showSpinner, hideSpinner } = useGlobal()

export default {
  components: { LanguageDialog },
  setup () {
    const { loggedIn } = useSession()
    const { isDevEnv } = useGlobal()
    const state = reactive({
      selected: undefined,
      rows: undefined,
      localizationJsonUrl: undefined,
      localizationSpreadsheetUrlLive: undefined,
      localizationSpreadsheetUrlDev: undefined
    })
    const selectRow = async (language, event) => {
      console.log('event.target.tagName', event.target)
      if (event.target.tagName !== 'TD') return
      state.selected = language
    }
    const toggleLanguage = async (language) => {
      try {
        showSpinner()
        const deleted = language.deleted === 1
        const response = await axios({
          method: 'delete',
          url: 'slot/language_for_crud',
          params: { languageId: language.id }
        })
        hideSpinner()
        if (response.data !== 1) {
          await alerta('Error deleting language')
        }
        // const languageForDeletion = state.rows.findIndex(lang => lang.id === language.id)
        language.deleted = deleted ? 0 : 1
      } catch (error) {
        hideSpinner()
        await alerta('Error deleting language', error)
      } finally {
        hideSpinner()
      }
    }
    const delLanguage = async (language) => {
      if (!(await confirma('Do you really want to delete this language?'))) return
      try {
        showSpinner()
        const response = await axios({
          method: 'delete',
          url: 'slot/language_for_crud',
          params: { languageId: language.id, remove: true }
        })
        hideSpinner()
        if (response.data !== 1) {
          await alerta('Error deleting language')
        }
        // const languageForDeletion = state.rows.findIndex(lang => lang.id === language.id)
        const rowForDeletionIdx = state.rows.findIndex(_row => _row.id === language.id)
        state.rows.splice(rowForDeletionIdx, 1)
      } catch (error) {
        hideSpinner()
        await alerta('Error deleting language', error)
      } finally {
        hideSpinner()
      }
    }
    const languageCloseDialog = async (data) => {
      showSpinner()
      console.log('data', data)
      const { language, files } = data
      const fd = new FormData()
      fd.append('id', language.id)
      if (language.languageCode) fd.append('language_code', language.languageCode)
      if (language.localizationUrl) fd.append('localization_url', language.localizationUrl)
      if (language.textureUrl) fd.append('texture_url', language.textureUrl)
      if (files.localization) { fd.append('localizationFile', files.localization) }
      if (files.texture) { fd.append('textureFile', files.texture) }
      if (language.isNew) fd.append('isNew', language.isNew)
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
        else {
          const idxLanguage = state.rows.findIndex(lang => lang.id === languageFromDb.id)
          state.rows[idxLanguage] = languageFromDb
        }
        hideSpinner()
      } catch (error) {
        hideSpinner()
        await alerta('Error submiting language', error)
      } finally {
        hideSpinner()
      }
    }
    const addLanguage = () => {
      state.selected = {
        id: -1, isNew: true, deleted: 0
      }
    }
    const languageCancel = () => {
      state.selected = undefined
    }
    const refreshJSON = async (row) => {
      showSpinner()
      try {
        const resp = await axios.post('/slot/localizations_update_for_crud', { languageCode: row.languageCode, environment: isDevEnv ? 'dev' : 'live' })
        row.updatedAt = resp.data
        console.log('resp', resp)
        notify({ message: `${row.languageCode} was updated`, icon: 'check' })
      } catch (err) {
        hideSpinner()
        await alerta('Error update json file', err)
      } finally {
        hideSpinner()
      }
    }
    const openJson = (row) => {
      const url = isDevEnv ? state.localizationSpreadsheetUrlDev : state.localizationSpreadsheetUrlLive
      console.log('url', url)
      window.open(url, '_blank')
    }
    const getClass = (lang) => {
      console.log('lang', lang)
      let newClass = ''
      if (lang.deleted === 1) newClass += 'deleted'
      console.log('clss', lang.deleted, newClass)
      return newClass
    }
    const submitSettings = async () => {
      try {
        await axios.post('/slot/settings_for_localization_for_crud', {
          localizationJsonUrl: state.localizationJsonUrl,
          localizationSpreadsheetUrlDev: state.localizationSpreadsheetUrlDev,
          localizationSpreadsheetUrlLive: state.localizationSpreadsheetUrlLive
        })
      } catch (err) {
        await alerta('Error', err)
        return
      }
      Notify.create({
        message: 'Settings where saved',
        icon: 'save',
        color: 'green-8'
      })
    }
    const makeDefault = async (row) => {
      state.rows.forEach(_row => { _row.isDefault = false })
      console.log('row', row)
      row.isDefault = 1
      await axios.post('slot/language_default_for_crud', { id: row.id })
      notify({ message: `${row.languageCode} is now the default`, icon: 'check' })
    }
    watch(() => loggedIn, async () => {
      showSpinner()
      const response = await axios({ url: '/slot/languages_for_crud', method: 'get' })
      state.rows = response.data.data
      state.localizationSpreadsheetUrlDev = response.data.localizationSpreadsheetUrlDev
      state.localizationSpreadsheetUrlLive = response.data.localizationSpreadsheetUrlLive
      state.localizationJsonUrl = response.data.localizationJsonUrl
      hideSpinner()
    }, { immediate: true })
    return {
      ...toRefs(state),
      toggleLanguage,
      getClass,
      languageCloseDialog,
      languageCancel,
      addLanguage,
      delLanguage,
      selectRow,
      makeDefault,
      refreshJSON,
      openJson,
      isDevEnv,
      submitSettings
    }
  }
}
</script>

<style lang="scss">
  .img-td{
    // max-width: 50px!important;
    min-width: 100px!important;
    img{
      // width: 100%;
      height: auto;
      border-radius: 8px;
    }
  }
  tr.deleted{
    text-decoration: line-through;
  }
  tr .remove{
    position:absolute; right: 0px; top: 8px;
    text-decoration: unset !important;
    display: none;
  }
  tr:hover .remove {
    display: block;
    cursor: pointer;
  }
  td.is-default {
    max-width: 140px;
    min-width: 120px;
    width: 140px;
    min-width: 120px;
    padding: 0;
    margin: 0;
  }
  .active-td{
    width: 100px;
    max-width: 150px;
  }
  .dot-menu-td {
    width: 10px;
    .dot-menu{
      width: 40px;
    }
  }
</style>
