<template>
<div>
  <q-select :disable="!editing" v-if="activeRule" class="q-ml-md" dense style="width:150px"
            v-model="activeRule.type" :options="types"/>
  <div v-for="(rule, index) of rules"  :key="index">
    <Rule v-if="rule.type === activeRule.type" :rule="rule" :editing="editing"/>
  </div>
</div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
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
      model: props.rules,
      activeRule: props.rule
    })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
