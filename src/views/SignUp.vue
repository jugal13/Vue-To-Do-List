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
                <v-card-subtitle class="text-center">Sign Up</v-card-subtitle>
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
                    <v-text-field
                      v-model="confirm_password"
                      label="Confirm Password"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      :rules="[rules.required, rules.min]"
                      :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      clearable
                      @click:append="showConfirmPassword = !showConfirmPassword"
                    ></v-text-field>
                  </v-form>
                </v-container>
                <v-card-actions class="justify-center">
                  <v-btn class="secondary" v-on:click.stop="signUpUser">Login</v-btn>
                  <v-btn class="primary" v-on:click.stop="clear">Clear</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  name: "signup",
  data: () => ({
    email: "",
    password: "",
    confirm_password: "",
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
    showPassword: false,
    showConfirmPassword: false
  }),
  mounted: function() {
    let currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      this.$store.commit("updateUser", currentUser);
      this.$router.push("home");
    }
  },
  methods: {
    signUpUser() {
      if (this.password === this.confirm_password) {
        if (this.email !== "" && this.password !== "") {
          let data = {
            email: this.email,
            password: this.password
          };

          this.$store.dispatch("signUpWithEmailAndPassword", data).then(() => {
            this.$router.push("home");
          });
        } else {
          this.snackbarText = "Email or password cannot be empty";
          this.snackbar = true;
        }
      } else {
        this.snackbarText = "Passwords do not match";
        this.snackbar = true;
      }
    }
  },

  clear() {
    this.email = "";
    this.password = "";
    this.confirm_password = "";
  }
};
</script>
