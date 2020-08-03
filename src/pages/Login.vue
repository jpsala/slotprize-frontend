<template>
  <div class="q-pa-md row q-gutter-md justify-center">
    <q-card class="my-card">
      <q-card-section class="seccion-ingreso">
        <div class="text-h5">Login</div>
      </q-card-section>
      <q-separator />
      <q-form class="q-gutter-md" @submit="onSubmit">
        <q-card-section>
          <q-input v-model="user.email" label="Email *" lazy-rules
                   :rules="[ val => val && val.length > 0 || 'Enter your Email']" type="email" />
          <q-input v-model="user.password" type="password" label="Password *" lazy-rules
                   :rules="[val => val !== null && val !== '' || 'Enter your Password']" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Ingresar" type="submit" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>
<script>
import { ref, onBeforeMount, watch } from '@vue/composition-api'
import useSession from '../services/useSession'
// import router from '../boot/router';
// import store from 'src/store'

export default {
  setup (props, ctx) {
    const user = ref({
      email: '',
      password: '',
      saveCredentials: 'false'
    })
    const {
      login, logout, loggedIn
    } = useSession()
    const gotoHomePage = () => {
      ctx.root.$router.push('/')
    }
    const notifyFailure = (error) => {
      console.log('error', error)
      ctx.root.$q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: error
      })
    }
    const onSubmit = async () => {
      try {
        const loginData = await login(user.value)
        if (loginData.status === 200) gotoHomePage()
        else { notifyFailure(`error status: ${loginData.status}`) }
      } catch (error) {
        console.error('onsubmit', error)
        if (error.status === 401) notifyFailure('Revise los datos (401)')
        else notifyFailure(`error: ${error}`)
      }
    }
    onBeforeMount(() => {
      console.log('li', loggedIn.value)
    })
    watch(() => loggedIn.value, (_loggedIn) => {
      if (_loggedIn) gotoHomePage()
    }, { immediate: true })
    return {
      user, login, logout, onSubmit
    }
  }

}
</script>
<style lang="stylus" scoped>
.my-card
  @media (max-width: $breakpoint-xs-max)
    width: 100%
    max-width: 450px
    min-width: 350px
  @media (min-width: $breakpoint-sm-min)
    width: 450px
  font-size: 10px
  .seccion-ingreso
    background-color: $primary
    color: white;
</style>
