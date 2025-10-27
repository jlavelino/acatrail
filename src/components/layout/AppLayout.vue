<script setup>
import { isAuthenticated } from '@/utils/supabase'
import ProfileHeaderNavigation from './ProfileHeaderNavigation.vue'
import { onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps(['isWithAppBarNavIcon'])

const emit = defineEmits(['isDrawerVisible'])

// Load Variables
const isLoggedIn = ref(false)

// Get Authentication status from supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

// Load Functions during component rendering
onMounted(() => {
  getLoggedStatus()
})

const theme = ref('light')
const visible = ref(false) // Define visible here
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" color="white" border app>
        <v-app-bar-nav-icon
          v-if="props.isWithAppBarNavIcon"
          icon="mdi-menu"
          :theme="theme"
          @click="emit('isDrawerVisible')"
        >
        </v-app-bar-nav-icon>

        <!-- Move the image next to the menu -->
        <v-img src="/images/logo.png" alt="AcaTrail Logo" height="100" class="ml-2" />
        <span class="text-logo ms-2">Aca<span class="text-logos">Trail</span></span>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <!-- Add a spacer to push the ProfileHeaderNavigation to the right -->
        <v-spacer></v-spacer>
        <ProfileHeaderNavigation v-if="isLoggedIn"></ProfileHeaderNavigation>
      </v-app-bar>
      <slot name="navigation"></slot>
      <v-main>
        <slot name="content"> </slot>
      </v-main>
      <v-footer class="text-center" color="white" border app>
        <div class="d-flex justify-center align-center w-100">Copyright | AcaTrail Website</div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
/* App bar */
.v-app-bar {
  background-color: #006400 !important;
  color: #ffd700 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #0b6623;
}

/* Footer */
.v-footer {
  background-color: #006400 !important;
  color: #ffd700 !important;
  font-weight: 500;
}

/* Bounce animation (unchanged) */
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

/* Global font */
v-app {
  font-family: 'Roboto', sans-serif;
}

/* Typography */
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

/* Paragraph text */
.text-center {
  font-family: 'Lora', serif;
}

/* Subtitles */
.text-subtitle-1 {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
}

/* Navbar Logo Text */
.text-logo {
  font-size: 35px;
  font-weight: 900;
  color: #ffd700;
}

.text-logos {
  color: white;
}
</style>
