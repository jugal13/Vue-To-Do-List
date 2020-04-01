<template>
  <v-app-bar dense prominent tile elevation="9" max-height="56px" height="52px">
    <v-toolbar-title>
      <v-btn elevation="0" rounded v-on:click.stop="handleRoute">To Do List</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="loggedIn">
      <v-container>
        <v-layout justify-center align-center>
          <v-spacer></v-spacer>
          <v-btn rounded elevation="0" v-on:click.stop="handleLogout">Logout</v-btn>
        </v-layout>
      </v-container>
    </div>
  </v-app-bar>
</template>
<script>
export default {
  name: "Navbar",
  computed: {
    loggedIn() {
      return this.$store.state.user != null;
    }
  },
  methods: {
    handleLogout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push({ path: "/" });
      });
    },
    handleRoute() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>