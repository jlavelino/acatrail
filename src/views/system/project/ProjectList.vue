<script setup>
import { onMounted, ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import ProjectFormDialog from './ProjectFormDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const projectsStore = useProjectsStore()

// Load Variables
const itemData = ref(null)
const isDialogVisible = ref(false)
const deleteId = ref(null)
const isConfirmDeleteDialog = ref(false) // Added this ref

// Add project
const onAdd = () => {
  itemData.value = null
  isDialogVisible.value = true
}

// Update project
const onUpdate = (project) => {
  itemData.value = project
  isDialogVisible.value = true
}

// Trigger Delete Dialog
const onDelete = (id) => {
  deleteId.value = id
  isConfirmDeleteDialog.value = true // Set dialog visibility to true
}

// Confirm Delete
const onConfirmDelete = async () => {
  try {
    const { error } = await projectsStore.deleteProjects(deleteId.value)
    if (error) {
      console.error(error.message)
      return
    }
    // Refresh the projects list
    await projectsStore.getProjects()
    isConfirmDeleteDialog.value = false // Hide dialog after successful deletion
  } catch (err) {
    console.error('Error deleting project:', err.message)
  }
}

onMounted(async () => {
  if (projectsStore.projects.length === 0) {
    await projectsStore.getProjects()
  }
})

// For the tabs part
const tab = ref('one')
</script>

<template>
  <v-card>
    <v-tabs v-model="tab" class="auth-background tabs-head">
      <v-tab value="one">Your PROJECT</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-card class="mx-auto" max-width="100%" hover>
            <v-row>
              <v-col>
                <v-card-item>
                  <v-card-title style="font-family: 'Poppins'; color: #095bea">
                    <b>To Do Projects</b>
                    <v-icon
                      class="mdi mdi-alert-octagon"
                      style="font-size: 25px"
                      color="red-darken-3"
                    ></v-icon>
                  </v-card-title>
                  <v-card-subtitle> Plan, Prioritize, and Complete your Project </v-card-subtitle>
                </v-card-item></v-col
              >
              <v-col class="pt-10">
                <button class="create-new-btn rounded-pill" @click="onAdd">
                  <i class="mdi mdi-plus"></i> Create Project
                </button>
              </v-col>
            </v-row>

            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  class="pa-4"
                  v-for="project in projectsStore.projects"
                  :key="project.id"
                >
                  <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>
                  <v-card class="mb-5 custom-border" elevation="0" outlined>
                    <v-card-text class="d-flex justify-space-between align-center">
                      <div>
                        <div v-if="project.data && Object.keys(project.data).length">
                          <ul>
                            <li v-for="(value, key) in project.data" :key="key">
                              <span class="font-weight-bold">{{ key }}</span
                              >: {{ value }}
                            </li>
                          </ul>
                        </div>

                        <div><strong>Description: </strong>{{ project.description || 'N/A' }}</div>
                        <div>
                          <strong>Additional Notes:</strong>
                          {{ project.additional_notes || 'N/A' }}
                        </div>
                        <div><strong>Due Date:</strong> {{ project.due_date || 'N/A' }}</div>
                        <div><strong>Due Time:</strong> {{ project.due_time || 'N/A' }}</div>

                        <!-- Image -->
                        <v-img
                          v-if="project.image_url"
                          :src="project.image_url"
                          height="150"
                          cover
                        ></v-img>
                      </div>
                      <div>
                        <v-card-actions style="display: flex; justify-content: flex-end">
                          <v-btn
                            icon
                            variant="elevated"
                            density="comfortable"
                            color="black"
                            @click="onUpdate(project)"
                          >
                            <v-icon size="20">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="elevated"
                            density="comfortable"
                            color="red"
                            @click="onDelete(project.id)"
                          >
                            <v-icon size="20">mdi-delete</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>

  <ProjectFormDialog
    v-model:is-dialog-visible="isDialogVisible"
    :item-data="itemData"
  ></ProjectFormDialog>

  <ConfirmDialog
    v-model:is-dialog-visible="isConfirmDeleteDialog"
    title="Confirm Delete"
    text="Are you sure you want to delete this project?"
    @confirm="onConfirmDelete"
  ></ConfirmDialog>
</template>

<style scoped>
/* STYLING */
.create-new-btn {
  background: #095bea;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Poppins';
}
</style>
