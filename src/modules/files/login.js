import axios from 'axios'
import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'

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
    },

    TICKLING (state) {
      state.tick += 1
    }
  },

  actions : {
    async login ({ commit, state }, payload) {
      try {
        console.log(payload, 'payload')
        const response = await axios.post('/login', payload)

        return response.data
      } catch (error) {
        console.log(error)
        throw error
      }
    },

    logout ({ commit }) {
      try {
        commit('LOGOUT')
      } catch (error) {
        console.log(error)
      }
    }
  }
}