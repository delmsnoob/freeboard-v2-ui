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
    },

    async register({ commit, state }, payload) {
      try {
        const response = await axios.post('/register', { payload })
        return response
        // console.log(response.error)
      } catch (error) {
        console.log(error)
        throw error
      }
    },

    async checkLoginId({ state, commit }, { loginId }) {
      try {
        return await axios.get(`/users/${loginId}`)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}