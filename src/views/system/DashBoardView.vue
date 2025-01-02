<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/navigation/SideNavigation.vue'
import ProjectFormDialog from './project/ProjectFormDialog.vue'
import AssignmentFormDialog from './assignment/AssignmentFormDialog.vue'

import { ref } from 'vue'
import { useDisplay } from 'vuetify'
const isDrawerVisible = ref(true)
const itemData = ref(null)
// Separate visibility states for project and assignment dialogs
const isProjectDialogVisible = ref(false)
const isAssignmentDialogVisible = ref(false)

// Show project dialog
const onAdd = () => {
  itemData.value = null
  isProjectDialogVisible.value = true
}
// Show assignment dialog
const onAddAssignment = () => {
  itemData.value = null
  isAssignmentDialogVisible.value = true
}
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
          <v-container class="pb-10 d-flex justify-center">
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

        <h4 class="text-center"><i>'Welcome Message from AcaTrail'</i></h4>

        <!-- Divider -->
        <v-divider :thickness="2" class="border-opacity-100 mt-3" color="info"></v-divider>
        <v-row>
          <v-col>
            <v-carousel height="300" show-arrows="hover">
              <v-carousel-item
                class="justify-center"
                src="/carousel_image/it110.jpg"
                height="300"
              ></v-carousel-item>

              <v-carousel-item
                class="justify-center"
                src="/carousel_image/ite15.png"
                height="300"
              ></v-carousel-item>

              <v-carousel-item
                class="justify-center"
                src="/carousel_image/107.png"
                height="300"
              ></v-carousel-item>
              <v-carousel-item
                class="justify-center"
                src="/carousel_image/ETHICS.jpg"
                height="300"
              ></v-carousel-item>
              <v-carousel-item
                class="justify-center"
                src="/carousel_image/pc.png"
                height="300"
              ></v-carousel-item>
              <v-carousel-item
                class="justify-center"
                src="/carousel_image/pe.png"
                height="300"
              ></v-carousel-item>
            </v-carousel>
            <v-row class="d-flex justify-center align-center">
              <!-- Add Assignment button on the left with margin -->
              <v-col cols="6" class="pt-5 pr-5 d-flex justify-start">
                <button class="create-new-btn rounded-pill" @click="onAddAssignment">
                  <i class="mdi mdi-plus"></i> Add Assignment
                </button>
              </v-col>

              <!-- Create Project button on the right with margin -->
              <v-col cols="6" class="pt-5 pl-5 d-flex justify-end">
                <button class="create-new-btn rounded-pill" @click="onAdd">
                  <i class="mdi mdi-plus"></i> Create Project
                </button>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>

  <!-- Separate dialogs for project and assignment -->
  <ProjectFormDialog
    v-model:is-dialog-visible="isProjectDialogVisible"
    :item-data="itemData"
  ></ProjectFormDialog>

  <AssignmentFormDialog
    v-model:is-dialog-visible="isAssignmentDialogVisible"
    :item-data="itemData"
  ></AssignmentFormDialog>
</template>
<style scoped>
.create-new-btn {
  background: #095bea;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Poppins';
}
</style>
