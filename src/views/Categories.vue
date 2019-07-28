<template>
<v-card>
        <v-app-bar app fixed class="black--text toolbar">
          <v-app-bar-nav-icon @click="$router.go(-1)">
            <v-icon>arrow_back</v-icon>
          </v-app-bar-nav-icon>
        </v-app-bar>
        <v-sheet elevation="5">
          <v-container>
  <div>Cat is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Id is: {{ $route.params.id }}</div>
  <div>Cat is: {{ id }}</div>
          </v-container>
        </v-sheet>
</v-card>
</template>


<script>

export default {
  name: "Categories",
  components: {
  },
  props: {
    id: {
      type: String,
      default: function() {
        return "";
      }
    }
  }
};
</script>

<style scoped>
</style>
