<template>
  <div>
    <q-select
      :disable="!editing" v-if="activeRule" class="q-ml-md" style="width:150px"
      v-model="activeRule.type" :options="types"
    />
    <div v-for="(rule, index) of clonedRules" :key="index" >
      <Rule v-if="rule.type === activeRule.type" @change="(rule)=>$emit('change', rule)"
            :rule="rule" :editing="editing"
      />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
import clone from 'rfdc'
import Rule from '../components/Rule'
// import useSession from 'src/services/useSession'
export default {
  components: { Rule },
  props: {
    rules: {
      default: undefined
    },
    rule: undefined,
    editing: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const state = reactive({
      types: ['cron', 'unique', 'daily', 'weekly'],
      activeRule: clone()(props.rule),
      clonedRules: clone()(props.rules)
    })
    let idx = 0
    console.log('state.activeRule', state.activeRule)
    for (const rule of state.clonedRules) {
      if (rule.type === state.activeRule.type) { state.clonedRules[idx] = state.activeRule }
      idx++
    }
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
