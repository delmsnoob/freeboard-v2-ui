import axios from 'axios'

export default {
  namespaced: true,

  state: {
    posts: [],
    count: 0
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
