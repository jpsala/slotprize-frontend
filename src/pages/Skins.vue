<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Skins</h3>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Background Color</th>
          <th class="text-center">Image</th>
          <th class="text-center"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" @click="selectRow(row, $event)" class="cursor-pointer">
          <td class="text-left">{{row.name}}</td>
          <td class="text-left">{{row.machineBgColor}}</td>
          <td class="text-right img-td"><img :src="row.machineSkinTextureUrl" /></td>
          <td class="text-right remove-td">
            <q-icon @click="delSkin(row.id)" class="remove" name="remove_circle_outline"
                    size="30px" color="red-5" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <SkinDialog :model="selected" @close="skinCloseDlg" @cancel="skinCancel"/>
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-btn :disable="selected !== undefined" @click="addSkin" fab icon="add" color="red-6" />
    </q-page-sticky>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import SkinDialog from '../components/SkinDialog'
import { alerta, confirma } from 'src/helpers'
import useGlobal from '../services/useGlobal'

const { showSpinner, hideSpinner } = useGlobal()
export default {
  components: { SkinDialog },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      selected: undefined,
      rows: []
    })
    const selectRow = async (skin, event) => {
      if (event.target.tagName !== 'TD') return
      state.selected = skin
    }
    const delSkin = async (skinId) => {
      if (!(await confirma('Sure?'))) return
      try {
        showSpinner()
        const response = await axios({
          method: 'delete',
          url: 'slot/skin_for_crud',
          params: { skinId }
        })
        hideSpinner()
        if (response.data !== 1) {
          await alerta('Error deleting skin')
        }
        const idxSkinForDeletion = state.rows.findIndex(_skin => _skin.id === skinId)
        state.rows.splice(idxSkinForDeletion, 1)
      } catch (error) {
        hideSpinner()
        await alerta('Error deleting skin', error)
      } finally {
        hideSpinner()
      }
    }
    const skinCloseDlg/* Submit */ = async (data) => {
      const { skin, files } = data
      var fd = new FormData()
      fd.append('id', skin.id)
      if (skin.name) fd.append('name', skin.name)
      if (skin.machineBgColor) fd.append('machineBgColor', skin.machineBgColor)
      if (skin.machineSkinTextureUrl) fd.append('machineSkinTextureUrl', skin.machineSkinTextureUrl)
      if (skin.isNew) fd.append('isNew', skin.isNew)
      if (files.length > 0) { fd.append('file', files[0]) }
      showSpinner()
      const axiosAnt = axios.defaults.headers.post['Content-Type']
      try {
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
        const response = await axios({
          method: 'post',
          url: 'slot/skin_for_crud',
          data: fd,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        axios.defaults.headers.post['Content-Type'] = axiosAnt
        const skinFromDb = response.data
        state.selected = undefined
        if (skin.isNew) state.rows.push(skinFromDb)
        else {
          const idxSkin = state.rows.findIndex(_skin => _skin.id === skinFromDb.id)
          state.rows[idxSkin] = skinFromDb
        }
        hideSpinner()
      } catch (error) {
        hideSpinner()
        await alerta('Error submiting skin', error)
      } finally {
        hideSpinner()
      }
    }
    const addSkin = () => {
      state.selected = {
        id: -1, isNew: true
      }
    }
    const skinCancel = () => {
      state.selected = undefined
    }
    watch(() => loggedIn, async () => {
      showSpinner()
      const response = await axios({ url: '/slot/skins_for_crud', method: 'get' })
      state.rows = response.data
      hideSpinner()
    }, { immediate: true })
    return { ...toRefs(state), skinCloseDlg, skinCancel, addSkin, delSkin, selectRow }
  }
}
</script>

<style lang="scss">
  .remove-td{
    width: 20px;
  }
  .img-td{
    max-width: 50px!important;
    width: 100px!important;
    img{
      width: 100%;
      height: auto;
      border-radius: 8px;
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
