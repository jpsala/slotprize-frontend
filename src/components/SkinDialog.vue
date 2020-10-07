<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <SkinEdit
        @cancel="$emit('cancel')"
        :model="model"
        :languages="languages"
        @close="function(formData){ $emit('close', formData) }"
      />
    </q-dialog>
  </div>
</template>

<script>
import SkinEdit from '../components/Skin'

import { toRefs, reactive, computed } from '@vue/composition-api'
export default {
  components: { SkinEdit },
  props: {
    model: { type: Object },
    languages: { type: Array }
  },
  setup (props) {
    const state = reactive({
      showDialog: computed(() => props.model !== undefined)
    })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
