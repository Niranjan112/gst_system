<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">Congratulations you are connected to MetaMask {{getAdd}}</h1>
        <h1 class="text-center">Click on below button to get started</h1>
        <v-row align="center" justify="center" style="height: 100px;">
          <profile-form></profile-form>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  beforeMount() {
    this.$store.dispatch('connectMetamask')
    this.$store.dispatch('loadBlockchainData')
  },
  computed: {
    getAdd() {
      return this.$store.getters.user
    }
  }
};
</script>
