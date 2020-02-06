<template>
  <v-app>
    <div>
      <v-toolbar flat extended extension-height="2" color="indigo darken-4 white--text">
        <img src="@/assets/logo.png" alt="avatar" />

        <v-toolbar-title class="display-1">Goods & Service Tax</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-item v-for="menuItem in menuItems" :key="menuItem.text">
          <v-btn text large class="white--text" router :to="menuItem.route">{{menuItem.text}}</v-btn>
        </v-toolbar-item>
      </v-toolbar>
    </div>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
  computed: {
    menuItems() {
      let menuItems = [
        { text: "Home", route: "/" },
        { text: "Register", route: "/register" },
        { text: "About Us", route: "/about_us" }
      ];
      if (window.ethereum.selectedAddress || this.userIsConnected) {
        menuItems = [
          { text: "Home", route: "/" },
          { text: "Dashboard", route: "/dashboard" }
        ];
      }
      return menuItems;
    },
    userIsConnected() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  }
};
</script>
