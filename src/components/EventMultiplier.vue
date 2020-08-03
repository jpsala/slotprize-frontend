<template>
    <q-card-section>
        <q-input v-model="event.rule" label="Rule" />
    </q-card-section>
</template>

<script>
export default {
  name: 'EventMultiplier',
  props: {
    event: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus">

</style>
