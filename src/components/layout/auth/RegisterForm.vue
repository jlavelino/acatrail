<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref } from 'vue'
const refVForm = ref()

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmed_password: '',
}

const formData = ref({
  ...formDataDefault,
})

const onSubmit = () => {
  alert(formData.value.email)
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

const theme = ref('light')
const visible = ref(false) // Define `visible` here
</script>

<template>
  <v-form ref="refVform" @submit.prevent="onFormSubmit">
    <v-row class="pt-3">
      <!-- First Name on the left -->
      <v-col cols="6">
        <v-text-field
          v-model="formData.firstname"
          class="font-weight-bold"
          density="compact"
          label="Firstname"
          variant="outlined"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-col>

      <!-- Last Name on the right -->
      <v-col cols="6">
        <v-text-field
          v-model="formData.lastname"
          class="font-weight-bold"
          density="compact"
          label="Lastname"
          variant="outlined"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-col>
    </v-row>

    <div class="text-subtitle-1 font-weight-bold">Email</div>
    <v-text-field
      v-model="formData.email"
      class="font-weight-bold"
      density="compact"
      placeholder="Enter you email"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <div class="text-subtitle-1 font-weight-bold">Password</div>
    <v-text-field
      v-model="formData.password"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      class="font-weight-bold"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
      :rules="[requiredValidator, passwordValidator]"
    ></v-text-field>

    <div class="text-subtitle-1 font-weight-bold">Confirm Password</div>
    <v-text-field
      v-model="formData.confirmed_password"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      class="font-weight-bold"
      density="compact"
      placeholder="Enter your confirmed password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
      :rules="[
        requiredValidator,
        confirmedValidator(formData.confirmed_password, formData.password),
      ]"
    ></v-text-field>

    <v-btn type="submit" class="mb-8" color="blue" size="large" block> Register </v-btn>
  </v-form>
</template>
