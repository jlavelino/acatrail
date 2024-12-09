<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
//import AppLayout from '@/components/layout/AppLayout.vue'
//import RegisterForm from '@/components/layout/auth/RegisterForm.vue'

const theme = ref('light')
const visible = ref(false) // Define `visible` here
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <v-row class="d-flex align-center justify-center" style="width: 100%">
          <v-col cols="12" md="6" class="mx-auto">
            <!-- Add the bounce-animation class -->
            <v-img class="bounce-animation" src="ew.png" alt="Image" height="300" />
            <h3 class="text-center">
              It is your academic buddy. It will help you to organize tasks, assignments, and
              projects, keeping them on track and focused throughout your academic journey.
            </h3>
          </v-col>

          <v-col cols="12" md="6" class="mx-auto pt-10">
            <div>
              <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                <h1 class="text-center">Register</h1>
                <v-divider></v-divider>
                <RegisterForm> </RegisterForm>
                <v-divider></v-divider>
                <h5 class="text-center my-3">
                  Already have an account? Click here to
                  <RouterLink to="/">
                    <a
                      class="text-blue text-decoration-none"
                      href="#"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Login <v-icon icon="mdi-chevron-right"></v-icon> </a
                  ></RouterLink>
                </h5>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
main {
  background-image: url('/public/back_image.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

/* Bounce animation */
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

/* Apply a custom font to the entire app */
v-app {
  font-family: 'Roboto', sans-serif;
}

/* Customize header fonts */
h1,
h2,
h3 {
  font-family: 'Open Sans', sans-serif;
  font-weight: bold;
}
h1 {
  font-size: 40px;
}

h3 {
  font-size: 22px;
}

h5 {
  font-size: 15px;
}

/* Apply custom styles to the paragraph */
.text-center {
  font-family: 'Lora', serif;
}

/* Customize other text styles */
.text-subtitle-1 {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
}
</style>
