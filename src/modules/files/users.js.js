import axios from 'axios'
import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'

// import _get from 'lodash/get'

export default {
  namespaced: true,

  state: {
    token: null,
    ip: null
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
        vueLocalStorage.setItem('token', response.data)
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
