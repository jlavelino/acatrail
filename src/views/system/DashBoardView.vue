<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/navigation/SideNavigation.vue'

import { ref } from 'vue'
import { useDisplay } from 'vuetify'
const isDrawerVisible = ref(true)
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>
    <template #content>
      <v-container>
        <v-row>
          <v-container class="pa-16 pb-10 d-flex justify-center">
            <v-img src="/images/homepage.JPG" alt="AcaTrail Logo" height="400" width="1000" cover />
          </v-container>
        </v-row>

        <p style="text-align: justify; text-indent: 2em">
          <i>
            "Welcome to AcaTrail, your streamlined academic management companion, designed to guide
            you through every step of your academic journey. Here, you can effortlessly organize
            tasks, assignments, and projects, ensuring you stay on track and focused on achieving
            your goals. Let us simplify your studies so you can excel with confidence and clarity.
            Let’s start your journey to academic success together!"
          </i>
        </p>

        <h4 class="text-center">Welcome Message from AcaTrail</h4>

        <!-- Divider -->
        <v-divider :thickness="2" class="border-opacity-100 mt-3" color="info"></v-divider>
        <v-row>
          <v-col>
            <v-carousel height="300" show-arrows="hover">
              <v-carousel-item
                class="justify-center"
                src="/carousel_image/it110.jpg"
                alt="IT 110 Image"
                height="300"
              ></v-carousel-item>

              <v-carousel-item
                class="justify-center"
                src="/carousel_image/ite15.png"
                alt="Hotel Image"
                height="300"
              ></v-carousel-item>

              <v-carousel-item
                class="justify-center"
                src="/carousel_image/107.png"
                alt="Sunshine Image"
                height="300"
              ></v-carousel-item>
              <v-carousel-item
                class="justify-center"
                src="/carousel_image/ETHICS.jpg"
                alt="Sunshine Image"
                height="300"
              ></v-carousel-item>
              <v-carousel-item
                class="justify-center"
                src="/carousel_image/pc.png"
                alt="Sunshine Image"
                height="300"
              ></v-carousel-item>
              <v-carousel-item
                class="justify-center"
                src="/carousel_image/pe.png"
                alt="Sunshine Image"
                height="300"
              ></v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
