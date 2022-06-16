<template>
  <div class="login-inner form-inner">
    <div class="login-content form-content">
      <h2>
        {{ translate('login') }}
      </h2>
      <form
        class="form"
        @submit.prevent="handleLogin"
      >
        <div class="form__item">
          <InputWrap
            v-model="user.loginId"
            :placeholder="translate('LOGIN ID')"
            type="text"
          />
        </div>

        <div class="form__item">
          <InputWrap
            v-model="user.password"
            :placeholder="translate('PASSWORD')"
            type="password"
          />
        </div>

        <div class="form__item form__item--btn">
          <button class="btn--login">
            <div
              v-if="dataStatus.loading"
              class="loader-wrap"
            >
            </div>

            <span>
              {{ translate('login') }}
            </span>
          </button>
        </div>

        <div class="form__item form__item--btn">
          <button
            class="btn--login"
            @click="toRegister"
          >
            <div
              v-if="dataStatus.loading"
              class="loader-wrap"
            >
            </div>

            <span>
              {{ translate('create account') }}
            </span>
          </button>
        </div>

        <div
          v-if="err && err.length > 0"
          class="login-error form-error"
        >
          {{ err }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// lib
import axios from 'axios'
import _get from 'lodash/get'

import { mapActions, mapState } from 'vuex'

// components
import InputWrap from '@/components/base/InputWrap.vue'

// translations
import translations from '@/assets/js/translations/common/login'

// mixins
import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'
import { vueSessionStorage } from '@/assets/js/mixins/base/VueSessionStorage'

export default {
  name: 'Login',
  components: {
    InputWrap
  },

  data () {
    return {
      translations,
      user: {
        loginId: '',
        password: ''
      },
      err: null,

      dataStatus: {
        loading: false
      }
    }
  },

  computed: {
    ...mapState('users', [
      'token',
      'users'
    ])
  },

  methods: {
    ...mapActions('users', [
      'login',
      'getUser'
    ]),

    async handleLogin () {
      try {
        if (!this.user.loginId || !this.user.password) {
          return (this.err = 'All fields are required')
        }

        const data = {
          login_id: this.user.loginId,
          password: this.user.password
        }

        await this.login(data)

        if (!this.token || !this.token.data) {
          this.$_swal({
            type: 'error',
            title: this.translate('login failed')
          })
        }

        // vueLocalStorage.setItem('token', this.token.data)
        // vueLocalStorage.setItem('user', this.data.login_id)
        // vueSessionStorage.setItem('token', this.token.data)
        axios.defaults.headers.common.Authorization = `Bearer ${vueLocalStorage.getItem('token')}`
        /*
        await this.getUser()

        if (this.user) {
          vueLocalStorage.setItem('userId', _get(this.user), 'id')
        } */
        // const userToken = vueLocalStorage.getItem('user')
        // console.log(userToken, 'user token')
        await this.$router.push({ name: 'home' })
      } catch (error) {
        this.err = error.response.data.message
        this.dataStatus = false
        console.log(error)
      }
    },

    toRegister () {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
