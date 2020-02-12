import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from 'web3'
import Gst from '@/contracts/Gst.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    gst: null,
    showForm: true
  },
  mutations: {
    setUser(state, account) {
      state.user = account
    },
    setGst(state, gst_contract) {
      state.gst = gst_contract
    },
    showForm(state, boolVal) {
      state.showForm = boolVal
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
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]
      if(networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        console.log(gst)
        const userCount = await gst.methods.userCount().call()
        console.log(userCount)
        const loadAccount = await gst.methods.usersMap(0).call()
        console.log(loadAccount)
        if(userCount < 1) {
          commit('showForm', true)
        }
        else {
          commit('showForm', false)
        }
      }
      else {
        window.alert('Gst System is on another network')
      }
    },
    async createProfile(state, payload) {
      const web3 = window.web3
      //Load account
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]
      if(networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        gst.methods.createAccount(
          payload.userId,
          payload.firstName,
          payload.lastName,
          payload.email,
          payload.gstNumber,
          payload.userType
        ).send({ from: payload.address}).then(
          console.log('done')
        )
      }
    }
  },
  getters: {
    user(state) {
      return state.user
    },
    showForm(state) {
      return state.showForm
    }
  }
})