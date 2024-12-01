<script setup>
import { ref } from 'vue'

const theme = ref('light')
const visible = ref(false) // Define `visible` here
</script>

<template>
  <v-form>
    <v-row class="pt-3">
      <!-- First Name on the left -->
      <v-col cols="6">
        <v-text-field
          class="font-weight-bold"
          density="compact"
          label="Firstname"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <!-- Last Name on the right -->
      <v-col cols="6">
        <v-text-field
          class="font-weight-bold"
          density="compact"
          label="Lastname"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>

    <div class="text-subtitle-1 font-weight-bold">Email</div>
    <v-text-field
      class="font-weight-bold"
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
    ></v-text-field>

    <div class="text-subtitle-1 font-weight-bold">Password</div>
    <v-text-field
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      class="font-weight-bold"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
    ></v-text-field>

    <v-btn class="mb-8" color="blue" size="large" block> Register </v-btn>
  </v-form>
</template>
