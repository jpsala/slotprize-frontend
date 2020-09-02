<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Countries</h3>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Currency</th>
          <th class="text-left">Phone Prefix</th>
          <th class="text-left">Language</th>
          <th class="text-center">Image</th>
          <th class="text-center"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row) in rows" :key="row.id" @click="selectRow(row, $event)" class="cursor-pointer">
          <td class="text-left">{{row.name}}</td>
          <td class="text-left">{{row.currency}}</td>
          <td class="text-left">{{row.phonePrefix}}</td>
          <td class="text-left">{{row.languageCode}}</td>
          <td class="text-right img-td"><img :src="row.textureUrl" /></td>
          <td class="text-right remove-td">
            <q-icon @click="delCountry(row.id)" class="remove" name="remove_circle_outline"
                    size="30px" color="red-5" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <CountryDialog :country="selected" :languages="languages" @close="countryClose" @cancel="countryCancel"/>
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-btn :disable="selected !== undefined" @click="addCountry" fab icon="add" color="red-6" />
    </q-page-sticky>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import CountryDialog from '../components/CountryDialog'
import { alerta, confirma } from 'src/helpers'

export default {
  components: { CountryDialog },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      selected: undefined,
      rows: [],
      languages: []
    })
    const selectRow = async (country, event) => {
      if (event.target.tagName !== 'TD') return
      state.selected = country
    }
    const delCountry = async (countryId) => {
      if (!(await confirma('Sure?'))) return
      try {
        const response = await axios({
          method: 'delete',
          url: 'slot/country_for_crud',
          params: { countryId }
        })
        if (response.data !== 1) {
          await alerta('Error deleting country')
        }
        const idxCountryForDeletion = state.rows.findIndex(lang => lang.id === countryId)
        state.rows.splice(idxCountryForDeletion, 1)
      } catch (error) {
        await alerta('Error deleting country', error)
      }
    }
    const countryClose = async (data) => {
      const { country, files } = data
      var fd = new FormData()
      fd.append('id', country.id)
      if (country.name) fd.append('name', country.name)
      if (country.languageId) fd.append('language_id', country.languageId)
      if (country.textureUrl) fd.append('texture_url', country.textureUrl || '')
      if (country.phonePrefix) fd.append('phone_prefix', country.phonePrefix)
      if (country.currency) fd.append('currency', country.currency)
      if (country.isNew) fd.append('isNew', country.isNew)
      if (files.length > 0) { fd.append('file', files[0]) }
      const axiosAnt = axios.defaults.headers.post['Content-Type']
      try {
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
        const response = await axios({
          method: 'post',
          url: 'slot/country_for_crud',
          data: fd,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        axios.defaults.headers.post['Content-Type'] = axiosAnt
        const countryFromDb = response.data
        state.selected = undefined
        if (country.isNew) state.rows.push(countryFromDb)
        else {
          const idxCountry = state.rows.findIndex(lang => lang.id === countryFromDb.id)
          state.rows[idxCountry] = countryFromDb
        }
      } catch (error) {
        await alerta('Error submiting country', error)
      }
    }
    const addCountry = () => {
      state.selected = {
        id: -1, isNew: true
      }
    }
    const countryCancel = () => {
      state.selected = undefined
    }
    watch(() => loggedIn, async () => {
      const response = await axios({ url: '/slot/countries_for_crud', method: 'get' })
      state.rows = response.data.countries
      state.languages = response.data.languages
    }, { immediate: true })
    return { ...toRefs(state), countryClose, countryCancel, addCountry, delCountry, selectRow }
  }
}
</script>

<style lang="scss">
  .remove-td{
    width: 20px;
  }
  .img-td{
    max-width: 20px!important;
    width: 20px!important;
    img{
      width: 100%;
      height: auto;
    }
  }
  tr{
    .remove{
      position:absolute;
      right: 0px; top: 8px;
      display: none;
    }
    &:hover .remove{
      display: block;
      cursor: pointer;
    }
  }
</style>
