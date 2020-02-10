import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from 'web3'
import Gst from '@/contracts/Gst.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    gst: null
  },
  mutations: {
    setUser(state, account) {
      state.user = account
    },
    setGst(state, gst_contract) {
      state.gst = gst_contract
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
    async loadBlockchainData() {
      const web3 = window.web3
      //Load account
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]
      console.log(accounts[0])
      console.log(networkId)
      console.log(networkData)
      if(networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        console.log(gst)
      }
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  }
})