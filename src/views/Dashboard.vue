<template>
  <v-container fluid>
    <v-row v-if="showProfileForm" align="center" justify="center">
      <v-col cols="12" align="center" justify="center">
        <h2 class="my-2 orange--text text--darken-3">Congratulations you are connected to MetaMask</h2>
        <v-img src="@/assets/tick.png" max-width="50px" max-height="50px"></v-img>
        <h2 class="my-2 orange--text text--darken-3">{{getAddress}}</h2>
        <v-row align="center" justify="center">
          <v-card max-width="700px">
            <v-card-title class="justify-center">
              <span class="headline">Fill your user profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="First Name"
                      v-model="firstName"
                      hint="Should be alphabet only"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Last Name"
                      v-model="lastName"
                      hint="Should be alphabet only"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Email" v-model="email" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="GST Number" v-model="gstNumber" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['Merchant','Wholeseller','Customer']"
                      label="User Type"
                      v-model="userType"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" type="submit" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <h1 class="text-center display-4" style="margin-top: 200px">Welcome,</h1>
        <h1 class="text-center display-3">{{userAccountDetails.firstName}} {{userAccountDetails.lastName}}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      gstNumber: '',
      userType: ''
    };
  },
  beforeMount() {
    this.$store.dispatch("connectMetamask");
    this.$store.dispatch("loadBlockchainData", { address: this.getAddress });
  },
  computed: {
    getAddress() {
      return this.$store.getters.user
    },
    showProfileForm() {
      return this.$store.getters.showForm
    },
    userAccountDetails() {
      return this.$store.getters.getAccountDetail
    }
  },
  methods: {
    save () {
      this.$store.dispatch('createProfile',{firstName: this.firstName, lastName: this.lastName, email: this.email, gstNumber: this.gstNumber, userType: this.userType, address: this.getAddress})
    }
  }
};
</script>
