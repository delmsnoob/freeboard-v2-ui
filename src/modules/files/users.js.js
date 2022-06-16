import axios from 'axios'
import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'
import { vueSessionStorage } from '@/assets/js/mixins/base/VueSessionStorage'

// import _get from 'lodash/get'

export default {
  namespaced: true,

  state: {
    token: null,
    ip: null,
    users: {}
  },

  mutations: {
    SET_USER (state, params) {
      state[params.name] = params.data
    },

    LOGOUT (state) {
      vueLocalStorage.removeItem('token')
      state.token = null
    },

    TICKLING (state) {
      state.tick += 1
    }
  },

  actions: {
    async login ({ state }, payload) {
      try {
        const response = await axios.post('/users/login', payload)
        state.token = response
        vueLocalStorage.setItem('userId', payload.login_id)
        const user_token = vueLocalStorage.getItem('userId')
        console.log(user_token)
        vueLocalStorage.setItem('token', response.data)
        vueSessionStorage.setItem('token', response.data)
      } catch (error) {
        console.log(error)
        throw error
      }
    },

    async logout ({ commit }) {
      try {
        await commit('LOGOUT')
        console.log(this.state.token)
      } catch (error) {
        console.log(error)
      }
    },

    async register ({ commit, state }, payload) {
      try {
        const response = await axios.post('/users/register', payload)
        state.err = response
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },

    async checkLoginId ({ state, commit }, { loginId }) {
      try {
        return await axios.get(`/users/${loginId}`)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
