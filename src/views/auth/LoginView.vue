<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<script>
export default {
  data: () => ({
    visible: false,
  }),
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-main>
        <v-container
          class="d-flex align-center justify-center"
          style="height: 100vh; min-height: 100vh"
        >
          <v-row class="d-flex align-center justify-center" style="width: 100%">
            <v-col cols="12" md="6" class="mx-auto pb-16">
              <v-img src="ew.png" alt="" height="300" />
              <h3 class="text-center">
                It is your academic buddy. It will help you to organize tasks, assignments, and
                projects, keeping them on track and focused throughout your academic journey.
              </h3>
            </v-col>

            <v-col cols="12" md="6" class="mx-auto pt-10">
              <div>
                <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                  <h1 class="text-center">Login</h1>
                  <div class="text-subtitle-1 font-weight-bold">Account</div>

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

                  <v-btn class="mb-8" color="blue" size="large" block> Log In </v-btn>
                  <v-divider></v-divider>
                  <h5csdcsdfsdf></h5csdcsdfsdf>
                  <h5 class="text-center my-3">
                    Don't have an account? Click here to
                    <RouterLink to="/register">
                      <a
                        class="text-blue text-decoration-none"
                        href="#"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Register <v-icon icon="mdi-chevron-right"></v-icon> </a
                    ></RouterLink>
                  </h5>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-footer class="text-center" color="white" border app>
        <div class="d-flex justify-center align-center w-100">Copyright | AcaTrail Website</div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
main {
  background-image: url('/public/back_image.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  height: 100vh;
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
