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
            v-model="data.login_id"
            :placeholder="translate('LOGIN ID')"
            type="text"
          />
        </div>

        <div class="form__item">
          <InputWrap
            v-model="data.password"
            :placeholder="translate('PASSWORD')"
            type="password"
          />
        </div>

        <div class="form__item">
          <InputWrap
            v-model="confirmPassword"
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

          <div
            v-if="err && err.length > 0"
            class="login-error form-error"
          >
            {{ err }}
          </div>
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
      data: {
        login_id: '',
        password: ''
      },
      confirmPassword: '',
      err: null,

      dataStatus: {
        loading: false
      }
    }
  },

  methods: {
    ...mapActions('users', {
      register: 'register',
      checkLoginId: 'checkLoginId'
    }),

    async handleRegister () {
      try {
        if (
          !this.data.login_id ||
          !this.data.password
        ) {
          return (this.err = 'All fields are required')
        }

        const params = {
          loginId: this.data.login_id,
          password: this.data.password,
          confirmPassword: this.confirmPassword
        }

        const response =  await this.register(params)

        if (response) {
          await this.$router.push({ name: 'login' })
        }

        return response.error

      } catch (error) {
        this.err = error.response.data.message
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
    }
  }
}
</script>

