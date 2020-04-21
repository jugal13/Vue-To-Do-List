<template>
  <v-container>
    <v-container fluid>
      <v-layout justify-center>
        <v-flex row justify-center align-center>
          <v-card width="300">
            <v-container>
              <v-card-title class="justify-center">My To Do List</v-card-title>
              <v-card-subtitle class="text-center">Add Item</v-card-subtitle>
              <v-text-field
                v-model="item"
                append-outer-icon="mdi-plus"
                clearable
                @click:append-outer="createItem"
              ></v-text-field>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid v-for="(eachItem, index) in listOfItems" :key="index">
      <v-layout justify-center>
        <v-flex row justify-center align-center>
          <v-card width="300">
            <v-container fluid>
              <v-layout align-center>
                <span v-bind:class="{ 'completed-text': eachItem.completed }">{{ eachItem.text }}</span>
                <v-spacer></v-spacer>
                <v-btn text small min-width="0" width="40" @click="openDialog(eachItem)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn text small min-width="0" width="40" v-on:click="deleteData(eachItem)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </v-layout>
            </v-container>
          </v-card>
          <v-dialog v-model="edit" width="300">
            <v-card width="300">
              <v-card-title>Edit Item</v-card-title>
              <v-container fluid>
                <v-form>
                  <v-text-field v-model="editedItem.text"></v-text-field>
                  <v-checkbox v-model="editedItem.completed" label="Completed"></v-checkbox>
                </v-form>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="green" v-on:click="edit = false">Cancel</v-btn>
                <v-btn text color="green" v-on:click="updateData(eachItem)">Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "home",
  data: () => ({
    item: "",
    edit: false,
    editedItem: {
      id: "",
      text: "",
      completed: false
    }
  }),
  computed: {
    listOfItems: function() {
      return this.$store.state.toDoItems;
    }
  },
  mounted() {
    this.$store.dispatch("getItems");
  },
  methods: {
    createItem() {
      const data = {
        completed: false,
        createdAt: Date.now(),
        userId: this.$store.state.user.uid,
        text: this.item
      };
      this.$store.dispatch("addItem", data);
      this.item = "";
    },

    openDialog(data) {
      console.log(data);
      this.editedItem.id = data.id;
      this.editedItem.text = data.text;
      this.editedItem.completed = data.completed;
      this.edit = true;
    },

    updateData(item) {
      let data = {
        id: this.editedItem.id,
        text: this.editedItem.text,
        completed: this.editedItem.completed
      };
      this.$store.dispatch("updateItem", data);
      this.editedItem = {
        id: "",
        text: "",
        completed: false
      };
      this.edit = false;
    },

    deleteData(item) {
      let data = item.id;
      this.$store.dispatch("deleteItem", data);
    }
  }
};
</script>

<style lang="scss" scoped>
.completed-text {
  text-decoration: line-through;
}
</style>
