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
        <!-- Welcome Banner -->
        <v-row>
          <v-col>
            <v-img
              src="/images/homepage.JPG"
              alt="AcaTrail Banner"
              height="220"
              cover
              class="rounded-lg mb-3"
            />
            <h2 class="font-weight-bold text-primary mt-0">Welcome to AcaTrail</h2>
            <p class="text-muted" style="font-size: 17px">
              Effortless academic management from schedule to success.
            </p>
          </v-col>
        </v-row>

        <!-- Today Overview Cards -->
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-card elevation="2" class="px-3 py-2">
              <h3 class="mb-1 font-weight-bold">Today’s Classes</h3>
              <div>10:00AM — IT 109-HIRAYA, Room CL7</div>
              <div>1:30PM — IT 114-MASAWA, MH 104</div>
              <!-- ...dynamically list student's schedule... -->
              <v-btn small color="primary" class="mt-2" @click="goToFullSchedule"
                >Full Schedule</v-btn
              >
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card elevation="2" class="px-3 py-2">
              <h3 class="mb-1 font-weight-bold">Upcoming Deadlines</h3>
              <div>IT 199 — Project due at 08:00 PM</div>
              <!-- Dynamically list...
              Highlight if near due -->
              <v-btn small color="deep-orange" class="mt-2" @click="showAssignments"
                >View All Assignments</v-btn
              >
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card elevation="2" class="px-3 py-2">
              <h3 class="mb-1 font-weight-bold">Progress</h3>
              <v-progress-linear
                :value="75"
                color="success"
                height="8"
                class="mb-1"
              ></v-progress-linear>
              <div>3/4 tasks completed this week</div>
              <div class="text-success mt-1">Keep it up!</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-row class="mb-2 d-flex justify-space-between">
          <v-btn color="info" class="rounded-pill px-5" @click="onAddAssignment">
            <v-icon left>mdi-plus</v-icon> Add Assignment
          </v-btn>
          <v-btn color="primary" class="rounded-pill px-5" @click="onAdd">
            <v-icon left>mdi-plus</v-icon> Create Project
          </v-btn>
        </v-row>

        <!-- Announcement/Motivation Card -->
        <v-row>
          <v-col>
            <v-alert
              type="info"
              border="left"
              color="primary lighten-3"
              icon="mdi-lightbulb-on-outline"
              elevation="2"
            >
              Tip: Start your most urgent assignment first, then move on to easier tasks!
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
  <!-- Project & Assignment dialogs, unchanged -->
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
.text-primary {
  color: #095bea;
}
</style>
