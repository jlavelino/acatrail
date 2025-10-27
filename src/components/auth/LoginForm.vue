<script setup>
import AlertNotification from '../common/AlertNotification.vue'
import { supabase } from '@/utils/supabase'
import { requiredValidator, emailValidator } from '@/utils/validators'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const theme = ref('light')
const visible = ref(false)
const refVForm = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const formActionDefault = {
  formProcess: false,
  formErrorMessage: '',
  formSuccessMessage: '',
  formStatus: null,
}

const formAction = ref({ ...formActionDefault })

// Make onSubmit async to use await
const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    formAction.value.formSuccessMessage = 'Successfully Logged'
    router.replace('/system/dashboard')
  }

  refVForm.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  >
  </AlertNotification>

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <div class="pt-2 text-subtitle-1 font-weight-bold">Email</div>

    <v-text-field
      v-model="formData.email"
      class="font-weight-bold"
      density="compact"
      placeholder="Email address"
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
      :rules="[requiredValidator]"
    ></v-text-field>

    <v-btn type="submit" class="csu-login-btn mb-4" size="large" block>Log In</v-btn>
  </v-form>
</template>

<style scoped>
.csu-login-btn {
  background-color: #006400 !important;
  color: #ffd700 !important;
  font-weight: 700;
  font-size: 17px;
  border-radius: 10px;
  letter-spacing: 1px;
  margin-top: 8px;
  box-shadow: 0 3px 14px rgba(0, 64, 32, 0.08);
  transition: background 0.2s;
}
.csu-login-btn:hover,
.csu-login-btn:focus {
  background-color: #034d15 !important; /* darken on hover/focus */
}
</style>
