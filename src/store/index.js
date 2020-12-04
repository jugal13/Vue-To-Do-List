import Vue from "vue";
import Vuex from "vuex";
import { db } from "@/utils/firebaseConfig";
import { auth } from "@/utils/firebaseConfig";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem("user")),
    busy: false,
    toDoItems: [],
  },

  getters: {
    getBusy: (state) => {
      return state.busy;
    },
  },

  mutations: {
    setBusy(state, value) {
      state.busy = value;
    },

    updateUser(state, payload) {
      state.user = payload;
    },

    logoutUser(state) {
      state.user = null;
    },

    setItems(state, value) {
      state.toDoItems = value;
    },
  },

  actions: {
    async logout(context) {
      let unsubscribe = context.state.postSubscription;
      await unsubscribe();
      await auth.signOut();
      localStorage.removeItem("user");
      context.commit("logoutUser");
    },

    async loginWithEmailAndPassword({ commit }, payload) {
      commit("setBusy", true);
      let userCredentials;
      try {
        userCredentials = await auth.signInWithEmailAndPassword(
          payload.email,
          payload.password
        );
      } catch (error) {
        commit("setBusy", false);
        console.log(error);
        throw error;
      }
      localStorage.setItem("user", JSON.stringify(userCredentials.user));
      commit("updateUser", userCredentials.user);
      commit("setBusy", false);
    },

    async loginWithGoogle({ commit }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      let authResult = await auth.signInWithPopup(provider).catch(() => {});
      localStorage.setItem("user", JSON.stringify(authResult.user));
      commit("updateUser", authResult.user);
    },

    async signUpWithEmailAndPassword({ commit }, payload) {
      commit("setBusy", true);
      let userCredentials = await auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );
      localStorage.setItem("user", JSON.stringify(userCredentials.user));
      commit("updateUser", userCredentials.user);
      commit("setBusy", false);
    },

    async getItems(context) {
      context.commit("setBusy", true);
      let items;
      let postSubscription = db
        .collection("todos")
        .where("userId", "==", context.state.user.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          items = [];
          snapshot.forEach((document) => {
            items.push({
              id: document.id,
              text: document.data().text,
              completed: document.data().completed,
            });
          });
          context.commit("setItems", items);
        });
      context.commit("setBusy", false);
      return postSubscription;
    },

    async addItem({ commit }, data) {
      await db.collection("todos").add(data);
    },

    async updateItem({ commit }, data) {
      await db
        .collection("todos")
        .doc(data.id)
        .update({ text: data.text, completed: data.completed });
    },

    async deleteItem({ commit }, id) {
      await db.collection("todos").doc(id).delete();
    },
  },
});
