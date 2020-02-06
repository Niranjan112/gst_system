import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from 'web3'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser(state, account) {
      state.user = account
    }
  },
  actions: {
    async connectMetamask({ commit }) {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying metamask')
      }
      const web3 = window.web3
      //Load account
      const accounts = await web3.eth.getAccounts()
      commit('setUser', accounts[0])
    },
    async loadBlockchainData({ commit }) {
      const web3 = window.web3
      //Load account
      const accounts = await web3.eth.getAccounts()
      commit('setUser', accounts)
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  }
})