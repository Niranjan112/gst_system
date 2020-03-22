import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from 'web3'
import Gst from '@/contracts/Gst.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    gst: null,
    showForm: null,
    currentUserObject: null,
    snackbar: null,
    billObject: null
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
    },
    currentUserObject(state, user) {
      state.currentUserObject = user
    },
    setSnackbar(state, snackValue) {
      state.snackbar = snackValue
    },
    setBillObject(state, bill) {
      state.billObject = bill
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
    async loadBlockchainData({ commit, getters }) {
      const web3 = window.web3
      //Load account
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]
      if(networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        const userCount = await gst.methods.userCount().call()
        const billCount = await gst.methods.billCount().call()
        const loadAccount = await gst.methods.usersMap(getters.user).call()
        let arr = []
        for( let i = 101 ; i <= billCount; i++) {
          arr.push(await gst.methods.billMap(i).call())
        }
        gst.methods.test2(104).call().then(r => {
          console.log(r)
        })
        // gst.methods.gstAmountValue(1).call().then(r => {
        //   console.log(r)
        // })
        if (arr) {
          var filteredBill = arr.filter( el => {
            return el.receiverAddress === loadAccount.addr
          })
        }
        console.log(filteredBill)
        commit('setBillObject', filteredBill)
        if(userCount < 1 || loadAccount.addr != getters.user) {
          commit('showForm', true)
        }
        else {
          commit('currentUserObject', loadAccount)
          commit('showForm', false)
        }
      }
      else {
        window.alert('Gst System is on another network')
      }
    },
    async createProfile({ commit,dispatch }, payload) {
      const web3 = window.web3
      //Load account
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]
      if(networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        console.log(payload, payload.lastName)
        await gst.methods.createAccount(
          payload.firstName,
          payload.lastName,
          payload.email,
          payload.gstNumber,
          payload.userType
        ).send({ from: payload.address })
        commit('showForm', false)
        dispatch('loadBlockchainData')
      }
    },
    async createBill({ commit }, payload) {
      const web3 = window.web3
      //Load account
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]
      if(networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        commit('showForm', false)
        console.log(payload.gstAmount)
        let bill = await gst.methods.generateBill(
          payload.receiverAddress,
          payload.material,
          payload.beforeGstAmount,
          payload.afterGstAmount,
          payload.gstAmount,
          payload.gstPercent,
          payload.address
        ).send({ from: payload.address})

        if(bill) {
          commit('setSnackbar', true)
          bill = null
        }
      }
    },
    async payBill({ commit }, payload ) {
      const web3 = window.web3
      //Load account
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]

      if(networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        commit('showForm', false)
        console.log(payload)
        await gst.methods.test(
          payload.billIssuer
        ).send({ from: payload.amountSender, value: payload.amount })
      }
    }
  },
  getters: {
    user(state) {
      return state.user
    },
    showForm(state) {
      return state.showForm
    },
    getCurrentAccountDetails(state) {
      return state.currentUserObject
    },
    getSnackbar(state) {
      return state.snackbar
    },
    getBillObject(state) {
      return state.billObject
    }
  }
})