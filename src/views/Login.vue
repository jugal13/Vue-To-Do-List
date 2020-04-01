<template>
  <v-container fill-height>
    <v-layout justify-center>
      <v-flex row justify-center align-center>
        <v-container fluid v-if="this.$store.getters.getBusy">
          <v-flex row justify-center>
            <v-progress-circular indeterminate></v-progress-circular>
          </v-flex>
        </v-container>
        <v-container fluid v-else>
          <v-layout justify-center>
            <v-flex row justify-center align-center>
              <v-card width="300">
                <v-card-title class="justify-center">To Do List</v-card-title>
                <v-card-subtitle class="text-center">Log In</v-card-subtitle>
                <v-container fluid>
                  <v-form>
                    <v-text-field v-model="email" label="Email" :rules="[rules.required]" clearable></v-text-field>
                    <v-text-field
                      v-model="password"
                      label="Password"
                      :type="showPassword ? 'text' : 'password'"
                      :rules="[rules.required, rules.min]"
                      :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      clearable
                      @click:append="showPassword = !showPassword"
                    ></v-text-field>
                  </v-form>
                </v-container>
                <v-card-actions class="justify-center">
                  <v-btn class="secondary" v-on:click="loginUser">Login</v-btn>
                  <v-btn class="primary" to="/signup">Sign Up</v-btn>
                </v-card-actions>
                <v-card-actions class="justify-center">
                  <v-btn text class="google-signin" v-on:click.stop="loginUserWithGoogle">
                    <v-img :src="require('@/assets/sign_in_button.svg')" width="30" height="30"></v-img>Sign in with google
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-snackbar color="error" v-model="snackbar">
      {{ snackbarText }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.google-signin {
  background-color: #4285f4;
}
</style>

<script>
export default {
  name: "login",
  data: () => ({
    email: "",
    password: "",
    snackbar: false,
    snackbarText: "",
    rules: {
      required: value => !!value || "Required.",
      min: v => {
        if (!v) {
          return "";
        }
        return v.length >= 6 || "Min 6 characters";
      }
    },
    showPassword: false
  }),
  mounted: function() {
    let currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      this.$router.push("home");
    }
  },
  methods: {
    loginUser() {
      if (this.email !== "" && this.password !== "") {
        let data = {
          email: this.email,
          password: this.password
        };
        this.$store
          .dispatch("loginWithEmailAndPassword", data)
          .then(() => {
            this.$router.push("home");
          })
          .catch(error => {
            this.snackbar = true;
            this.snackbarText = error.message;
          });
      } else {
        this.snackbarText = "Email or password cannot be empty";
        this.snackbar = true;
      }
    },

    loginUserWithGoogle() {
      this.$store.dispatch("loginWithGoogle").then(() => {
        this.$router.push("home");
      });
    }
  }
};
</script>
