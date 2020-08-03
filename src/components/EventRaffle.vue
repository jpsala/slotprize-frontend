<template>
<div>

    <q-card-section>
        <div class="text-subtitle1">
        <q-input v-model="event.description" label="Description" autogrow />
        </div>
    </q-card-section>
    <q-card-section>
        <div class="text-subtitle1">
            <q-input filled v-model="event.date">
                <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="dateProxy" transition-show="scale" transition-hide="scale">
                        <q-date @input="$refs.dateProxy.hide()" v-model="event.date" mask="YYYY-MM-DD HH:mm">
                            <div class="row items-center justify-end q-gutter-sm">
                                <q-btn label="Cancel" color="primary" flat v-close-popup />
                                <q-btn label="OK" color="primary" flat  v-close-popup />
                            </div>
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
                <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time @input="$refs.dateProxy.hide()" v-model="event.date" mask="YYYY-MM-DD HH:mm" format24h>
                                <div class="row items-center justify-end q-gutter-sm">
                                <q-btn label="Cancel" color="primary" flat v-close-popup />
                                <q-btn label="OK" color="primary" flat  v-close-popup />
                            </div>
                        </q-time>
                    </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
        </div>
    </q-card-section>
</div>
</template>

<script>
export default {
  name: 'EventRaffle',
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
