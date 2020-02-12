<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="550px">
      <template v-slot:activator="{ on }">
        <v-btn color="indigo darken-4 white--text" dark v-on="on" large>Complete your profile here</v-btn>
      </template>
      <v-card>
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
                <v-text-field label="First Name" v-model="firstName" hint="Should be alphabet only" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Last Name" v-model="lastName" hint="Should be alphabet only"></v-text-field>
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
                {{hi}}
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
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: ['hide'],
  data() {
    return {
      dialog: false,
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      gstNumber: '',
      userType: ''
    }
  },
  methods: {
    save () {
      const address = this.$store.getters.user
      this.$store.dispatch('createProfile',{ userId: this.userId, firstName: this.firstName, lastName: this.lastName, email: this.email, gstNumber: this.gstNumber, userType: this.userType, address: address}).then(
        this.dialog = false
      )
    }
  },
  computed: {
    hi() {
      return this.hide
    }
  }
}
</script>