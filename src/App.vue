<template>
  <v-app>
    <v-navigation-drawer app v-model="sideNav" temporary>
      <v-list>
        <v-list-item v-for="menuItem in menuItems" :key="menuItem.text" :to="menuItem.route">
          <v-list-item-icon>
            <v-icon>{{menuItem.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{menuItem.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark class="indigo darken-4">
      <v-app-bar-nav-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up"></v-app-bar-nav-icon>
      <router-link to="/">
        <img src="@/assets/logo.png" alt="avatar" class="pt-2"/>
      </router-link>

      <router-link to="/" tag="span" style="cursor: pointer">
        <v-toolbar-title class="display-1">Goods & Service Tax</v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-toolbar-items v-for="menuItem in menuItems" :key="menuItem.text" class="hidden-xs-only">
        <v-btn text large class="white--text" router :to="menuItem.route">
          <v-icon left>{{menuItem.icon}}</v-icon>{{menuItem.text}}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    sideNav: false
  }),
  computed: {
    menuItems() {
      let menuItems = [
        { text: "Home", route: "/", icon: 'home' },
        { text: "Register", route: "/register", icon: 'face' },
        { text: "About Us", route: "/about_us", icon: 'description' }
      ];
      if (window.ethereum.selectedAddress || this.userIsConnected) {
        menuItems = [
          { text: "Home", route: "/", icon: 'home' },
          { text: "Dashboard", route: "/dashboard", icon: 'dashboard' }
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
