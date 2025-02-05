<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import AlertNotification from '../common/AlertNotification.vue'
import { useRouter } from 'vue-router'

// Utilize pre-defined vue functions
const router = useRouter()

// Initialize form reference
const refVForm = ref()

// Default form data
const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmed_password: '',
}

// Reactive form data and actions
const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

// Register functionality
const onSubmit = async () => {
  //Reset form action utils
  formAction.value = { ...formActionDefault }
  // Turn on proccessing
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
      },
    },
  })

  if (error) {
    //Add Error Message
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    //Add Succeess Message
    formAction.value.formSuccessMessage = 'Successfully Registered'
    //Redirect to Dashboard
    router.replace('/system/dashboard')
  }
  //Reset form
  refVForm.value?.reset()
  // Turn off processing
  formAction.value.formProcess = false
}

// Form submission handler
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    console.log('Is form valid?', valid)
    if (valid) onSubmit()
  })
}

// Theme and visibility for password fields
const theme = ref('light')
const visible = ref(false) // Default visibility for passwords
</script>

<template>
  <!-- Success Alert -->
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  >
  </AlertNotification>

  <!-- Registration Form -->
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row class="pt-4">
      <!-- First Name Field -->
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

      <!-- Last Name Field -->
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

    <!-- Email Field -->
    <div class="text-subtitle-1 font-weight-bold">Email</div>
    <v-text-field
      v-model="formData.email"
      class="font-weight-bold"
      density="compact"
      placeholder="Enter your email"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-row>
      <v-col cols="6">
        <!-- Password Field -->
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
      </v-col>

      <v-col cols="6">
        <!-- Confirm Password Field -->
        <div class="text-subtitle-1 font-weight-bold">Confirm Password</div>
        <v-text-field
          v-model="formData.confirmed_password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          class="font-weight-bold"
          density="compact"
          placeholder="Confirm your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          :rules="[
            requiredValidator,
            confirmedValidator(formData.confirmed_password, formData.password),
          ]"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Submit Button -->
    <v-btn
      type="submit"
      class="mb-4"
      color="blue"
      size="large"
      block
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Register
    </v-btn>
  </v-form>
</template>
