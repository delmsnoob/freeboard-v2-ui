<template>
  <div class="auth-page-inner"></div>
</template>

<script>
import { mapActions } from 'vuex'

// lib
import axios from 'axios'

import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'
import { vueSessionStorage } from '@/assets/js/mixins/base/VueSessionStorage'

export default {
  name: 'Logout',

  data () {
    return {
      user: {
        u: '',
        p: ''
      }
    }
  },

  async created () {
    try {
      await this.logout()
      vueLocalStorage.clear()
      vueSessionStorage.removeItem('token')

      axios.defaults.headers.common['Authorization'] = `Bearer ${vueLocalStorage.getItem('token')}`

      this.$router.push({ name: 'login', query: this.$route.query })
    } catch (error) {
      console.log(error)
    } finally {
      this.$router.push({ path: '/login', query: this.$route.query })
    }
  },

  methods: {
    ...mapActions('users', [
      'logout'
    ])
  }
}
</script>
