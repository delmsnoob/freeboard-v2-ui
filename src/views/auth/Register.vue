<template>
  <div class="register-inner form-inner">
    <div class="register-content form-content">
      <h2>
        {{ translate('USER REGISTRATION') }}
      </h2>
      <form
        class="form"
        @submit.prevent="handleRegister"
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

        <div class="form__item">
          <InputWrap
            v-model="user.confirmPassword"
            :placeholder="translate('CONFIRM PASSWORD')"
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
              {{ translate('register') }}
            </span>
          </button>
        </div>

        <div class="form__item form__item--btn">
          <button
            class="btn--login"
            @click="toLogin"
          >
            <div
              v-if="dataStatus.loading"
              class="loader-wrap"
            >
            </div>

            <span>
              {{ translate('go back') }}
            </span>
          </button>
        </div>

        <div
          v-if="err && err.lenght > 0"
          class="login-error form-error"
        >
          {{ err }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import InputWrap from '@/components/base/InputWrap'
import translations from '@/assets/js/translations/common/register'

export default {
  name: 'Register',
  components: {
    InputWrap
  },

  data () {
    return {
      translations,
      user: {
        loginId: '',
        password: '',
        confirmPassword: ''
      },

      err: null,

      dataStatus: {
        loading: false
      }
    }
  },

  methods: {
    ...mapActions('users', [
      'register',
      'checkLoginId'
    ]),

    async handleRegister () {
      this.err = null
      try {
        if (
          !this.user.loginId ||
          !this.user.password ||
          !this.user.confirmPassword
        ) {
          return (this.err = 'All fields are required')
        } /* else if (!(this.data.password === this.confirmPassword)) {
          return (this.err = 'Password and confirm password dont match')
        } */

        const params = {
          login_id: this.user.loginId,
          password: this.user.password,
          confirm_password: this.user.confirmPassword
        }

        await this.register(params)
        await this.$router.push({ name: 'login' })
      } catch (error) {
        this.dataStatus = false
        console.log(error)
      }
    },

    async checkLoginId () {
      try {
        await this.checkLoginId({
          loginId: this.data.login_id
        })
      } catch (error) {
        throw new Error(error)
      }
    },

    toLogin () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
