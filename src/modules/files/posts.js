import axios from 'axios'

export default {
  namespaced: true,

  state: {
    posts: []
  },

  mutations: {},

  actions: {
    async createPost ({ commit, state }, payload) {
      try {
        await axios.post('/posts', payload)
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    }
  }
}
