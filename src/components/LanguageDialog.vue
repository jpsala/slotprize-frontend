<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <LanguageEdit
        @cancel="$emit('cancel')"
        :language="language"
        @close="function(formData){ $emit('close', formData) }"
      />
    </q-dialog>
  </div>
</template>

<script>
import LanguageEdit from '../components/Language'

import { toRefs, reactive, computed } from '@vue/composition-api'
export default {
  components: { LanguageEdit },
  props: {
    language: { type: Object }
  },
  setup (props) {
    const state = reactive({
      showDialog: computed(() => props.language !== undefined)
    })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
