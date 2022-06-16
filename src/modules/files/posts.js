import axios from 'axios'
import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'

export default {
  namespaced: true,

  state: {
    posts: [],
    count: 0,
    userId: null
  },

  getters: {},

  mutations: {
    SET_STATE (state, payload) {
      state[payload.name] = payload.data
    }
  },

  actions: {
    async createPost ({ commit, state }, payload) {
      try {
        await axios.post('/posts', payload)
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },

    async fetchPost ({ commit, state }, params) {
      try {
        const user = vueLocalStorage.getItem('token')
        console.log(user, 'user token')
        const response = await axios.get('/posts/fetchPosts', params)

        commit('SET_STATE', {
          name: 'posts',
          data: response.data.list
        })

        commit('SET_STATE', {
          name: 'count',
          data: response.data.count
        })
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    }
  }
}
