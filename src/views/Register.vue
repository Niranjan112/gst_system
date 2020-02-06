<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row align="center" justify="center" style="height: 400px;">
          <v-btn color="indigo darken-4 white--text" dark @click="loadWeb3" x-large>Start here</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      checkAccount: null
    };
  },
  methods: {
    loadWeb3() {
      this.$store
        .dispatch("connectMetamask")
        .then(() => this.$router.push("/dashboard"));
    }
  }
};
</script>