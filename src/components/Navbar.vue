<template>
  <div>
    <v-toolbar extended extension-height="2" color="indigo darken-4 white--text">
      
        <img src="../assets/logo.png" alt="avatar"/>
      
      <v-toolbar-title class="display-1">Goods & Service Tax</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-item v-for="link in links" :key="link.text" >
          <v-btn text large class="white--text" router :to="link.route">{{link.text}}</v-btn>
      </v-toolbar-item>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {text:"Home", route: '/'},
        {text:"About Us", route:'/about'},
        {text:"GST Law", route:'/gst_law'},
        {text:"Services", route:'/services'},
        {text:"Register", route:'/register'}
      ]
    }
  }
};
</script>