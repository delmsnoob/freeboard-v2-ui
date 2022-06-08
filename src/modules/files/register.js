import axios from 'axios'

export default {
  namespaced: true,

  mutations: {
    SET_USER(state, params) {
      state[params.name] = params.data
    },

    // TICKLING(state) {
    //   state.tick += 1
    // }
  },

  actions: {
    async register({ commit, state }, payload) {
      try {
        const response =  await axios.post('/register', { payload })
        return response
        // console.log(response.error)
      } catch (error) {
        console.log(error)
        throw error
      }
    },
  }
}