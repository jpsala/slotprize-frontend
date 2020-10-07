<template>
  <q-dialog
    :value="active"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="symbol-select">
      <q-card-section>
        <div class="text-h6">
          Select a Symbol
        </div>
      </q-card-section>
      <q-card-section
        class="q-mb-lg"
        style="text-align: center;"
      >
        <q-list bordered>
          <q-item
            v-for="symbol of symbols"
            :key="symbol.id"
            @click="selected = symbol"
            :active="selected === symbol"
            active-class="bg-teal-1 text-grey-8"
            clickable
            @dblclick="$emit('close', symbol)"
          >
            <q-item-section avatar>
              <q-img :src="symbol.textureUrl" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions
        class="q-mt-lg"
        align="right"
      >
        <q-btn
          :disable="!selected"
          @click="$emit('close', selected)"
          flat
        >
          Select Image
        </q-btn>
        <q-btn
          @click="$emit('close')"
          flat
        >
          Cancel
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
export default {
  props: {
    symbols: {
      type: Array,
      default: () => []
    },
    active: {
      default: () => false
    }
  },
  setup (_, { emit }) {
    const state = reactive({
      selected: undefined
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang='scss'>
  .symbol-select {
    .q-list {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      overflow: auto;
      padding: 10px;
      margin: auto;
      .q-item {
        cursor: pointer;
        width: 70px;
      }
    }
  }
</style>
