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

        <div class="form__item form__item--btn">
          <button class="btn--login">
            <div
              v-if="dataStatus.laoding"
              class="loader-wrap"
            >
            </div>

            <span>
              {{ translate('login') }}
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
import InputWrap from '@/components/base/InputWrap.vue'

import translations from '@/assets/js/translations/common/login'

import { mapActions } from 'vuex'

export default {
  name: 'Login',
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
      err: null,

      dataStatus: {
        loading: false
      }
    }
  },

  methods: {
    ...mapActions('users', {
      login: 'login'
    }),

    async handleLogin () {
      try {
        if (
          !this.data.login_id ||
          !this.data.password
        ) {
          return (this.err = 'All fields are required')
        }

        const token = await this.login({
          loginId: this.data.login_id,
          password: this.data.password
        })

        if (token) {
          await this.$router.push({ name: 'home' })
        } else {
          alert('User not found')
        }

        // axios.defaults.headers.Authorization = `Bearer ${token}`

        // vueLocalStorage.setItem('token', token)

        // await this.$router.push({name: 'post'})

      } catch (error) {
        this.err = error.response.data.message
        this.dataStatus = false
        console.log(error)
      }
    }
  }
}
</script>

