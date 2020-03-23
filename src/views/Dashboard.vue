<template>
  <v-container>
    <!-- Profile Form -->
    <div v-if="showProfileForm">
      <v-row align="center" justify="center">
        <v-col align="center" justify="center" cols="12">
          <h2 class="my-2 orange--text text--darken-3">Congratulations you are connected to MetaMask</h2>
          <v-img src="@/assets/tick.png" max-width="50px" max-height="50px"></v-img>
          <h2 class="my-2 orange--text text--darken-3">{{getAddress}}</h2>
          <v-card max-width="700px">
            <v-card-title class="indigo darken-4 white--text justify-center display-1">
              <span
                class="headline"
              >{{this.firstName || this.lastName ? 'Welcome, ' + this.firstName + ' ' + this.lastName :'Fill your user profile'}}</span>
            </v-card-title>
            <v-card-text class="indigo lighten-5">
              <v-container>
                <v-form v-model="isProfileFormValid">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="First Name"
                        v-model="firstName"
                        hint="Should be alphabet only"
                        color="indigo darken-4"
                        :rules="namesRules"
                        prepend-icon="person"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Last Name"
                        v-model="lastName"
                        hint="Should be alphabet only"
                        color="indigo darken-4"
                        :rules="namesRules"
                        prepend-icon="person"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Email"
                        v-model="email"
                        color="indigo darken-4"
                        required
                        :rules="emailRules"
                        prepend-icon="email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="GST Number"
                        v-model="gstNumber"
                        color="indigo darken-4"
                        :rules="gstRules"
                        prepend-icon="subject"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        :items="['Manufacturer','Wholesaler','Customer']"
                        label="User Type"
                        v-model="userType"
                        color="indigo darken-4"
                        :rules="[v => !!v || 'User type is required']"
                        prepend-icon="group"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions class="indigo lighten-5">
              <v-spacer></v-spacer>
              <v-btn
                color="indigo darken-4"
                large
                dark
                type="submit"
                :disabled="!isProfileFormValid"
                @click="save"
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- User Account Details -->
    <div v-else align="center" justify="center">
      <v-row class="mt-12" style="maxWidth: 100%;">
        <v-col>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="indigo darken-4 white--text headline">
                Welcome, {{currentUserAccountDetails.firstName}} {{currentUserAccountDetails.lastName}} ( {{getAddress}} )
                <template
                  v-slot:actions
                >
                  <v-icon color="white">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="indigo lighten-5">
                <v-row class="title text-center">
                  <v-col cols="12" sm="4">Email ID: {{currentUserAccountDetails.email}}</v-col>
                  <v-col cols="12" sm="4">GST Number: {{currentUserAccountDetails.gstNumber}}</v-col>
                  <v-col cols="12" sm="4">User Type: {{currentUserAccountDetails.userType}}</v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <!-- Generate Bill section -->
      <v-row style="maxWidth: 100%;">
        <v-col cols="12" sm="6" v-show="!(currentUserAccountDetails.userType == 'Customer')">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="indigo darken-4 white--text headline">
                Generate bill here
                <template v-slot:actions>
                  <v-icon color="white">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="indigo lighten-5">
                <v-form class="mt-5" v-model="isBillFormValid" ref="billForm">
                  <v-select
                    :items="billID"
                    label="Bill ID"
                    v-model="billSelect"
                    :rules="[v => !!v || 'Item is required']"
                    v-if="currentUserAccountDetails.userType === 'Wholesaler'"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="receiverAddress"
                    label="Receiver Address"
                    :rules="addressRules"
                  ></v-text-field>
                  <v-select
                    :items="['Cotton','Fabric','Plastic']"
                    label="Material"
                    v-model="material"
                    :rules="[v => !!v || 'Item is required']"
                    v-if="currentUserAccountDetails.userType === 'Manufacturer'"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="amount"
                    label="Amount in ether"
                    :rules="[v => !!v || 'Amount is required']"
                    required
                  ></v-text-field>
                  <v-card v-if="showBill && currentUserAccountDetails.userType === 'Manufacturer'" class="mx-auto green darken-1" max-width="350" outlined>
                    <v-card-text class="text-center white--text">
                      <p class="title">Receiver Bill</p>
                      <v-divider :inset="inset" class="white mx-3"></v-divider>
                      <div class="text-center white--text mt-5 subtitle-1">
                        <p>Receiver Address: {{generateBill.receiverAddress}}</p>
                        <p>Material Selected: {{generateBill.material}}</p>
                        <p>Amount: {{generateBill.amount}}</p>
                        <p>CGST: {{generateBill.gst}}%</p>
                        <p>SGST: {{generateBill.gst}}%</p>
                      </div>
                      <v-divider :inset="inset" class="white mx-3"></v-divider>
                      <p class="title mt-4">Total Amount: {{generateBill.totalAmount}} ETH</p>
                    </v-card-text>
                  </v-card>
                  <!-- Wholesaler's bill section -->
                  <v-card v-if="showBill && currentUserAccountDetails.userType === 'Wholesaler'" class="mx-auto green darken-1" max-width="350" outlined>
                    <v-card-text class="text-center white--text">
                      <p class="title">Receiver Bill</p>
                      <v-divider :inset="inset" class="white mx-3"></v-divider>
                      <div class="text-center white--text mt-5 subtitle-1">
                        <p>Receiver Address: {{receiverAddress}}</p>
                        <p>Material Selected: {{this.material = getSelectedBill.materialSelected}}</p>
                        <p>Amount: {{amount}}</p>
                        <p>CGST: {{generateBill.gst}}%</p>
                        <p>SGST: {{generateBill.gst}}%</p>
                      </div>
                      <v-divider :inset="inset" class="white mx-3"></v-divider>
                      <p class="title mt-4">Total Amount: {{generateBill.totalAmount}} ETH</p>
                    </v-card-text>
                  </v-card>
                  <div class="text-center">
                    <v-btn
                      class="indigo darken-4 mt-5"
                      dark
                      large
                      @click.prevent="sendBill"
                      type="submit"
                      :disabled="!isBillFormValid"
                    >Send Bill</v-btn>
                  </div>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <!-- Pending bill section -->
        <v-col cols="12" sm="6" v-show="!(currentUserAccountDetails.userType === 'Manufacturer')">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="indigo darken-4 white--text headline">
                Check your pending bill
                <template v-slot:actions>
                  <v-icon color="white">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="indigo lighten-5" v-if="getBillObject.length > 0">
                <div
                  v-for="bill in getBillObject" 
                  :key="bill.id" 
                  align="start" 
                  justify="start" 
                  class="mt-5"
                >
                  <v-row align="center" justify="center">
                    <v-col cols="9" sm="9">
                      <v-treeview
                        dark
                        class="red darken-2 subtitle-1" 
                        :items="[{id: bill.id, name: bill.materialSelected, children: [{name: 'From : ' + bill.billIssuer }, {name: 'Material : ' + bill.materialSelected }, {name: 'Total Amount : ' + bill.afterGstAmount + ' ETH' }]}]"
                      >
                      </v-treeview>
                    </v-col>
                    <v-col cols="3" sm="3">
                      <v-chip
                        color="green"
                        text-color="white"
                        class="ml-3"
                        @click="payAmount(bill.beforeGstAmount, bill.billIssuer, bill.receiverAddress)"
                      >
                        Pay Now 
                      </v-chip>
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-content>
              <v-expansion-panel-content v-else class="indigo lighten-5">
                <div class="mt-5 title red--text text--darken-2">
                  No pending bill available
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
// import Web3 from 'web3'
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      gstNumber: "",
      userType: "",
      receiverAddress: "",
      amount: "",
      inset: false,
      material: "",
      isProfileFormValid: false,
      isBillFormValid: false,
      timeout: 2000,
      snackbar: false,
      billObject: null,
      expand: false,
      billSelect: '',
      namesRules: [
        v => !!v || "This field is required",
        v => /^[a-zA-Z ]{1,30}$/.test(v) || "Only Alphabet allowed"
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      gstRules: [
        v => !!v || "GST number is required",
        v =>
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v) ||
          "GST number is not valid"
      ],
      addressRules: [
        v => /^0x[a-fA-F0-9]{40}$/.test(v) || "Address is not valid"
      ],
      maxwidth: 80
    };
  },
  beforeMount() {
    this.$store.dispatch("connectMetamask");
    this.$store.dispatch("loadBlockchainData");
  },
  computed: {
    getAddress() {
      return this.$store.getters.user;
    },
    showProfileForm() {
      return this.$store.getters.showForm;
    },
    currentUserAccountDetails() {
      return this.$store.getters.getCurrentAccountDetails;
    },
    generateBill() {
      let totalAmount = 0;
      let gst = 0;
      if (this.currentUserAccountDetails.userType.toLowerCase() === 'manufacturer') {
        if (this.material.toLowerCase() === "cotton") {
          gst = 20;
          totalAmount = Number(this.amount) + (gst / 100) * Number(this.amount);
        }
        if (this.material.toLowerCase() === "fabric") {
          gst = 30;
          totalAmount = Number(this.amount) + (gst / 100) * Number(this.amount);
        }
        if (this.material.toLowerCase() === "plastic") {
          gst = 40;
          totalAmount = Number(this.amount) + (gst / 100) * Number(this.amount);
        }
      }
      if (this.currentUserAccountDetails.userType.toLowerCase() === 'wholesaler') {
        if (this.getSelectedBill.materialSelected.toLowerCase() === "cotton") {
          gst = 20;
          totalAmount = Number(this.amount) + (gst / 100) * Number(this.amount);
        }
        if (this.getSelectedBill.materialSelected.toLowerCase() === "fabric") {
          gst = 30;
          totalAmount = Number(this.amount) + (gst / 100) * Number(this.amount);
        }
        if (this.getSelectedBill.materialSelected.toLowerCase() === "plastic") {
          gst = 40;
          totalAmount = Number(this.amount) + (gst / 100) * Number(this.amount);
        }
      }
      return {
        receiverAddress: this.receiverAddress,
        amount: this.amount,
        material: this.material,
        totalAmount: totalAmount,
        gst: gst / 2
      };
    },
    showBill() {
      if (this.receiverAddress && this.amount) {
        return true;
      }
      return false;
    },
    getBillObject() {
      return this.$store.getters.getBillObject;
    },
    billID() {
      let arr = []
      this.$store.getters.getBillObject.forEach((bill) => {
        arr.push(bill.id)
      })
      return arr
    },
    getSelectedBill() {
      let bill
      this.$store.getters.getBillObject.forEach((billData) => {
        if(parseInt(this.billSelect) === parseInt(billData.id)) {
          bill =  billData
        }
      })
      return bill
    }
  },
  methods: {
    save() {
      this.$store.dispatch("createProfile", {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        gstNumber: this.gstNumber,
        userType: this.userType,
        address: this.getAddress
      });
    },
    sendBill() {
      let gstAmount = []
      let amountFormat = this.generateBill.totalAmount - Number(this.amount)
      let checkInt = Number.isInteger(this.generateBill.totalAmount - Number(this.amount))
      amountFormat = checkInt ? amountFormat.toString() : amountFormat.toFixed(2)
      if (this.currentUserAccountDetails.userType.toLowerCase() === 'wholesaler') {
        const previousGst = Number(this.getSelectedBill.afterGstAmount) - Number(this.getSelectedBill.beforeGstAmount)
        gstAmount.push(previousGst.toString())
        console.log(amountFormat)
      }
      gstAmount.push(amountFormat)
      console.log(gstAmount)
      this.$store.dispatch("createBill", {
        receiverAddress: this.receiverAddress,
        material: this.material,
        beforeGstAmount: this.amount,
        afterGstAmount: this.generateBill.totalAmount.toString(),
        gstAmount,
        gstPercent: (this.generateBill.gst * 2).toString(),
        address: this.getAddress
      });
      this.$refs.billForm.reset()
      // console.log({
      //   receiverAddress: this.receiverAddress,
      //   material: this.material,
      //   beforeGstAmount: this.amount,
      //   afterGstAmount: this.generateBill.totalAmount.toString(),
      //   gstAmount,
      //   gstPercent: (this.generateBill.gst * 2).toString(),
      //   address: this.getAddress
      // })
    },
    payAmount (amount, billIssuer, amountSender) {
      console.log({amount: window.web3.utils.toWei(amount,'Ether'), billIssuer: billIssuer, amountSender: amountSender})
      this.$store.dispatch('payBill', {amount: window.web3.utils.toWei(amount,'Ether'), billIssuer: billIssuer, amountSender: amountSender})
    }
  }
};
</script>
