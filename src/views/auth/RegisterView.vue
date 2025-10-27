<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const theme = ref('light')
const visible = ref(false)
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="csu-bg">
        <v-row class="d-flex align-center justify-center" style="width: 100%">
          <!-- Registration Card -->
          <v-col cols="12" md="6" class="mx-auto pt-10">
            <v-card class="mx-auto pa-12 pb-8 csu-card" elevation="8" max-width="448" rounded="lg">
              <h1 class="text-center csu-title">Register</h1>
              <v-divider class="csu-divider my-4"></v-divider>
              <RegisterForm />
              <v-divider class="csu-divider my-4"></v-divider>
              <h5 class="text-center my-3">
                Already have an account? Click here to
                <RouterLink to="/">
                  <a class="csu-link text-decoration-none" href="#">
                    Login <v-icon icon="mdi-chevron-right"></v-icon>
                  </a>
                </RouterLink>
              </h5>
            </v-card>
          </v-col>

          <!-- Feature/Logo Section -->
          <v-col cols="12" md="6" class="mx-auto text-center">
            <v-img
              class="bounce-animation mb-4"
              src="/images/logo.png"
              alt="AcaTrail Logo"
              height="350"
            />
            <h3 class="csu-desc">
              It is your academic buddy. It will help you to organize tasks, assignments, and
              projects, keeping them on track and focused throughout your academic journey.
            </h3>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.csu-bg {
  background: linear-gradient(90deg, #0b6623 0%, #1aae6f 100%) !important;
  min-height: 100vh;
}

/* Card with CSU white surface */
.csu-card {
  background: #f5fbf7 !important;
  border: 1.5px solid #b2c2a0;
  box-shadow: 0 4px 12px rgba(0, 64, 32, 0.07);
}

/* Header */
.csu-title {
  color: #006400;
  font-family: 'Open Sans', sans-serif;
  font-weight: bold;
  text-shadow: none;
}

/* Primary dividers - green and gold blend */
.csu-divider {
  background: linear-gradient(90deg, #006400 0%, #ffd700 100%) !important;
  opacity: 0.9 !important;
  height: 3px;
  border-radius: 2px;
}

/* Input field border highlight - dark green */
.v-input:deep(.v-field__outline) {
  border-color: #006400 !important;
}

/* Register Button */
.v-btn,
.v-btn[tabindex] {
  background-color: #006400 !important;
  color: #ffd700 !important;
  font-weight: 700;
  font-size: 17px;
  border-radius: 10px;
  letter-spacing: 1px;
  margin-top: 12px;
}

/* General text fields and labels */
input,
.v-label {
  color: #34442b !important;
  font-family: 'Roboto', sans-serif;
}

/* Link highlight to CSU yellow */
.csu-link {
  color: #ffd700 !important;
  font-weight: 500;
}

/* Additional style for login and text */
h3,
h5 {
  font-family: 'Lora', serif;
  font-weight: bold;
  color: #003800;
}

/* Logo bounce animation for feature image */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.bounce-animation {
  animation: bounce 2.5s infinite;
}
</style>
