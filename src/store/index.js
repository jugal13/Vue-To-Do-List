import Vue from "vue";
import Vuex from "vuex";
import { db } from "@/utils/firebaseConfig";
import { auth } from "@/utils/firebaseConfig";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    busy: false,
    toDoItems: []
  },

  getters: {
    getBusy: state => {
      return state.busy;
    }
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
    }
  },

  actions: {
    async logout({ commit }) {
      await auth.signOut();
      localStorage.removeItem("user");
      commit("logoutUser");
    },

    async loginWithEmailAndPassword({ commit }, payload) {
      commit("setBusy", true);
      let userCredentials = await auth.signInWithEmailAndPassword(
        payload.email,
        payload.password
      );
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
      db.collection("todos")
        .where("userId", "==", context.state.user.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot(snapshot => {
          items = [];
          snapshot.forEach(document => {
            items.push({ id: document.id, text: document.data().text });
          });
          context.commit("setItems", items);
        });
      context.commit("setBusy", false);
    },

    async addItem({ commit }, data) {
      let result = await db.collection("todos").add(data);
    },

    async updateItem({ commit }, data) {
      let result = await db
        .collection("todos")
        .doc(data.id)
        .update({ text: data.text });
    },

    async deleteItem({ commit }, id) {
      let result = await db.collection("todos").doc(id).delete();
    }
  }
});
