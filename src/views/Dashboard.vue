<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="text-center">Congratulations you are connected to MetaMask {{getAddress}}</h2>
        <v-row align="center" justify="center">
          <v-card max-width="700px">
            <v-card-title>
              <span class="headline">Fill your user profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field label="Enter your ID" v-model="userId" required></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="First Name"
                      v-model="firstName"
                      hint="Should be alphabet only"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showProfileForm: true,
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      gstNumber: '',
      userType: ''
    };
  },
  beforeMount() {
    this.$store.dispatch("connectMetamask");
    this.$store.dispatch("loadBlockchainData");
  },
  computed: {
    getAddress() {
      return this.$store.getters.user
    },
    getForm() {
      return this.$store.getters.showForm
    }
  },
  methods: {
    save () {
      this.$store.dispatch('createProfile',{ userId: this.userId, firstName: this.firstName, lastName: this.lastName, email: this.email, gstNumber: this.gstNumber, userType: this.userType, address: this.getAddress})
    }
  }
};
</script>
