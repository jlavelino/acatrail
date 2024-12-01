<script setup>
import { ref } from 'vue'

const theme = ref('light')
const visible = ref(false) // Define `visible` here
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-main>
        <v-container
          class="d-flex align-center justify-center"
          style="height: 100vh; min-height: 100vh"
        >
          <slot name="content"> </slot>
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
