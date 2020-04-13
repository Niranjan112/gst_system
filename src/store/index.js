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
    billObject: null,
    receivePaymentObject: null
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
    },
    setReceivePaymentObject(state, bill) {
      state.receivePaymentObject = bill
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
      if (networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        const userCount = await gst.methods.userCount().call()
        const billCount = await gst.methods.billCount().call()
        const loadAccount = await gst.methods.usersMap(getters.user).call()
        let arr = []
        for (let i = 101; i <= billCount; i++) {
          arr.push(await gst.methods.billMap(i).call())
        }
        if (arr) {
          var filteredBill = arr.filter(el => {
            return el.receiverAddress === loadAccount.addr
          })
        }
        if(loadAccount.userType === 'Manufacturer' || loadAccount.userType === 'Wholesaler') {
          let receivePaymentBillArray = []
          arr.forEach(bill => {
            if(bill.billIssuer === loadAccount.addr) {
              receivePaymentBillArray.push(bill)
            }
          })
          console.log(receivePaymentBillArray)
          commit('setReceivePaymentObject', receivePaymentBillArray)
        }
        console.log(filteredBill)
        commit('setBillObject', filteredBill)
        if (userCount < 1 || loadAccount.addr != getters.user) {
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
    async createProfile({ commit, dispatch }, payload) {
      const web3 = window.web3
      //Load account
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]
      if (networkData) {
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
      if (networkData) {
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
        ).send({ from: payload.address })

        if (bill) {
          commit('setSnackbar', true)
          bill = null
        }
      }
    },
    async payBill({ commit, dispatch }, payload) {
      const web3 = window.web3
      //Load accoun
      const networkId = await web3.eth.net.getId()
      const networkData = Gst.networks[networkId]

      if (networkData) {
        const gst = new web3.eth.Contract(Gst.abi, networkData.address)
        commit('showForm', false)
        let gstAmount = await gst.methods.gstAmountArray(parseInt(payload.id)).call()
        console.log(gstAmount, payload.amount)
        let gstSub = Number(gstAmount[1]) - Number(gstAmount[0])
        console.log(gstSub)
        payload.amount = gstAmount.length > 1 ? (Number(payload.amount) + Number(gstAmount[0])).toFixed(2) : Number(payload.amount).toFixed(2)
        console.log(payload.amount)
        gstAmount = (gstAmount.length > 1 ? gstSub / 2 : Number(gstAmount[0]) / 2).toFixed(2)
        console.log(gstAmount)
        await gst.methods.transferAmountToUser(payload.billIssuer)
          .send({ from: payload.amountSender, value: window.web3.utils.toWei(payload.amount, "Ether") })

        await gst.methods.transferAmountToSGST("0xA7B6c710cb07EcA1C1Dd453029173F0B4922D80C")
          .send({ from: payload.amountSender, value: window.web3.utils.toWei(gstAmount, 'Ether') })
        
        await gst.methods.transferAmountToCGST("0xe9c9bC7cB68Bd94eB8fB512c62e1b69A6F03B596")
          .send({ from: payload.amountSender, value: window.web3.utils.toWei(gstAmount, 'Ether') })
        
        await gst.methods.paidBill(parseInt(payload.id), true)
          .send({ from: payload.amountSender })

        dispatch('loadBlockchainData')
        // gst.methods.transferAmountToUser(payload.billIssuer)
        //   .send({ from: payload.amountSender, value: window.web3.utils.toWei(payload.amount, "Ether") })
        //   .then(
        //     gst.methods.transferAmountToSGST("0xA7B6c710cb07EcA1C1Dd453029173F0B4922D80C")
        //       .send({ from: payload.amountSender, value: window.web3.utils.toWei(gstAmount, 'Ether') })
        //       .then(
        //         gst.methods.transferAmountToCGST("0xe9c9bC7cB68Bd94eB8fB512c62e1b69A6F03B596")
        //           .send({ from: payload.amountSender, value: window.web3.utils.toWei(gstAmount, 'Ether') })
        //           .then(
        //             gst.methods.paidBill(parseInt(payload.id), true)
        //               .send({ from: payload.amountSender }).then(
        //                 router.push('home')
        //               )
        //           ).then(
        //             dispatch('loadBlockchainData')
        //           )
        //       )
        //   )
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
    },
    getReceivePaymentObject(state) {
      return state.receivePaymentObject
    }
  }
})