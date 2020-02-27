<template>
  <v-container fluid>
    <!-- Profile Form -->
    <div v-if="showProfileForm">
      <v-row align="center" justify="center">
        <v-col align="center" justify="center" cols="12">
          <h2 class="my-2 orange--text text--darken-3">Congratulations you are connected to MetaMask</h2>
          <v-img src="@/assets/tick.png" max-width="50px" max-height="50px"></v-img>
          <h2 class="my-2 orange--text text--darken-3">{{getAddress}}</h2>
          <v-card max-width="700px">
            <v-card-title class="indigo darken-4 white--text justify-center display-1">
              <span class="headline">
                {{this.firstName || this.lastName ? 'Welcome, ' + this.firstName + ' ' + this.lastName :'Fill your user profile'}}
              </span>
            </v-card-title>
            <v-card-text class="indigo lighten-5">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="First Name"
                      v-model="firstName"
                      hint="Should be alphabet only"
                      color="indigo darken-4"
                      :rules="namesRules"
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
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field 
                      label="GST Number" 
                      v-model="gstNumber" 
                      color="indigo darken-4"
                      :rules="gstRules"
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['Merchant','Wholeseller','Customer']"
                      label="User Type"
                      v-model="userType"
                      color="indigo darken-4"
                      :rules="[v => !!v || 'User type is required']"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="indigo lighten-5">
              <v-spacer></v-spacer>
              <v-btn 
                color="indigo darken-4"
                large
                dark
                type="submit"
                @click="save"
                >Save
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- User Account Details -->
    <div v-else>
      <v-row class="mt-12">
        <v-col>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="indigo darken-4 white--text headline">
                Welcome, {{userAccountDetails.firstName}} {{userAccountDetails.lastName}} ( {{getAddress}} )
                <template
                  v-slot:actions
                >
                  <v-icon color="white">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="indigo lighten-5">
                <v-row class="title text-center">
                  <v-col cols="12" sm="4">Email ID: {{userAccountDetails.email}}</v-col>
                  <v-col cols="12" sm="4">GST Number: {{userAccountDetails.gstNumber}}</v-col>
                  <v-col cols="12" sm="4">User Type: {{userAccountDetails.userType}}</v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="indigo darken-4 white--text headline">
                Generate your bill here
                <template v-slot:actions>
                  <v-icon color="white">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="indigo lighten-5">
                <v-form class="mt-5">
                  <v-text-field 
                    v-model="receiverAddress"
                    label="Receiver Address"
                    :rules="addressRules"
                  >
                  </v-text-field>
                  <v-select
                    :items="['Cotton','Fabric','Plastic']"
                    label="Material"
                    v-model="material"
                    :rules="[v => !!v || 'Item is required']"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="amount"
                    label="Amount in ether"
                    :rules="[v => !!v || 'Amount is required']"
                    required
                  ></v-text-field>
                <v-card v-if="showBill" class="mx-auto green darken-1" max-width="350" outlined>
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
                <div class="text-center">
                  <v-btn class="indigo darken-4 mt-5" dark large @click="sendBill" type="submit">Send Bill</v-btn>
                </div>
                </v-form>
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
      namesRules: [
        v => !!v || 'This field is required',
        v => /^[a-zA-Z ]{1,30}$/.test(v) || 'Only Alphabet allowed'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      gstRules: [
        v => !!v || 'GST number is required',
        v => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v) || 'GST number is not valid'
      ],
      addressRules: [
        v => /^0x[a-fA-F0-9]{40}$/.test(v) || 'Address is not valid'
      ],
      maxwidth: 100
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
    userAccountDetails() {
      return this.$store.getters.getAccountDetail;
    },
    generateBill() {
      let totalAmount = 0;
      let gst = 0;
      if (this.material.toLowerCase() === "cotton") {
        gst = 20;
        totalAmount = parseInt(this.amount) + (gst / 100) * this.amount;
      }
      if (this.material.toLowerCase() === "fabric") {
        gst = 30;
        totalAmount = parseInt(this.amount) + (gst / 100) * this.amount;
      }
      if (this.material.toLowerCase() === "plastic") {
        gst = 40;
        totalAmount = parseInt(this.amount) + (gst / 100) * this.amount;
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
    }
  },
  methods: {
    save () {
      this.$store.dispatch("createProfile", {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        gstNumber: this.gstNumber,
        userType: this.userType,
        address: this.getAddress
      })
    },
    sendBill () {
      this.$store.dispatch("createBill", {
        receiverAddress: this.receiverAddress,
        material: this.material,
        amount: this.amount,
        address: this.getAddress
      })
    }
  }
};
</script>
