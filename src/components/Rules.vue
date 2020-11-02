<template>
  <div>
    <!-- <q-toggle v-show="!editing" :value="editing" @input="$emit('edit', value)" label="Expanded" class="q-mb-md" /> -->
    <q-list class="rounded-borders">
      <q-expansion-item icon="schedule" v-model="expanded" label="Rules">
        <q-select :disable="!editing" v-if="activeRule" class="q-ml-md" style="width:150px"
                  :value="activeType" @input="ruleTypeChange" :options="types" />
        <Rule ref="ruleRef" v-show="expanded" @change="ruleChanged" :rule="activeRule"
              :editing="editing" :viewalt="expanded" />
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import clone from 'rfdc'
import Rule from '../components/Rule'
import useSession from '../services/useSession'

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
  setup (props, { emit }) {
    const { isDev, user } = useSession()
    const state = reactive({
      types: ['unique', 'daily', 'weekly'],
      activeRule: clone()(props.rule),
      clonedRules: clone()(props.rules),
      activeType: undefined,
      expanded: false,
      ruleRef: undefined,
      ruleTypeChange (value) {
        emit('rule-type-change', props.rule)
        state.activeType = value
      },
      cancelEdition (oldRule) {
        console.log('cancel', oldRule)
        state.activeType = oldRule.type
        state.activeRule = clone()(oldRule)
      },
      ruleChanged (rule) {
        emit('change', rule)
        const idxAnt = state.clonedRules.findIndex(_rule => _rule.type === state.activeRule.type)
        state.clonedRules[idxAnt] = rule
      }
    })
    if (isDev.value) state.types.push('cron')
    state.activeType = state.activeRule.type
    watch(() => state.activeType, (type) => {
      console.log('changed', type)
      const rule = state.clonedRules.find(_rule => _rule.type === type)
      state.activeRule = rule
    }, { immediate: false })
    return { ...toRefs(state), isDev, user }
  }
}
</script>

<style>

</style>
