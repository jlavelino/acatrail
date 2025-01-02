<script setup>
import { onMounted, ref, computed } from 'vue'
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

const onFinish = async (id) => {
  try {
    const project = projectsStore.projects.find((a) => a.id === id)
    if (project) {
      project.status = 'finished' // Update status
    }
  } catch (err) {
    console.error('Error finishing project:', err.message)
  }
}

const finishedProjects = computed(() =>
  projectsStore.projects.filter((project) => project.status === 'finished'),
)

const tab = ref('one')
</script>

<template>
  <v-card>
    <v-tabs v-model="tab" class="auth-background tabs-head">
      <v-tab value="one">
        <v-card-title style="font-family: 'Poppins'; color: #095bea">
          <b>To Do Project</b>
          <v-icon
            class="mdi mdi-note-minus-outline"
            style="font-size: 25px"
            color="red-darken-4"
          ></v-icon>
        </v-card-title>
      </v-tab>
      <v-tab value="two">
        <v-card-title style="font-family: 'Poppins'; color: #095bea">
          <b>Finished Project</b>
          <v-icon
            class="mdi mdi-note-check-outline"
            style="font-size: 25px"
            color="green-accent-3"
          ></v-icon>
        </v-card-title>
      </v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <!-- To Do Projects Tab -->
        <v-tabs-window-item value="one">
          <v-card class="mx-auto" max-width="100%" hover>
            <v-row>
              <v-col>
                <v-card-item>
                  <v-card-title> Stay on Track</v-card-title>
                </v-card-item>
              </v-col>
              <v-col class="pt-5">
                <button class="create-new-btn rounded-pill" @click="onAdd">
                  <i class="mdi mdi-plus"></i> Create Project
                </button></v-col
              >
            </v-row>

            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  class="pa-4"
                  v-for="project in projectsStore.projects.filter((p) => p.status !== 'finished')"
                  :key="project.id"
                >
                  <h3 class="text-h6">
                    <strong>Project</strong>
                    <v-icon class="mdi mdi-alert-circle-outline" color="orange"></v-icon>
                  </h3>
                  <v-col class="pt-5">
                    <button class="create-new-btn rounded-pill" @click="onFinish(project.id)">
                      <i class="mdi mdi-plus"></i> Finish Project
                    </button>
                  </v-col>
                  <v-card class="mb-5 custom-border" elevation="0" outlined>
                    <v-card-text class="d-flex justify-space-between align-center">
                      <div>
                        <h4><strong>Description: </strong>{{ project.description || 'N/A' }}</h4>
                        <h4>
                          <strong>Additional Notes:</strong>
                          {{ project.additional_notes || 'N/A' }}
                        </h4>
                        <h4><strong>Due Date:</strong> {{ project.due_date || 'N/A' }}</h4>
                        <h4><strong>Due Time:</strong> {{ project.due_time || 'N/A' }}</h4>
                      </div>
                      <!-- Image -->
                      <v-img
                        v-if="project.image_url"
                        :src="project.image_url"
                        height="150"
                        width="150"
                        class="ml-4"
                      ></v-img>

                      <v-card-actions>
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
                    </v-card-text>
                  </v-card>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
        <!-- Finished Projects Tab -->
        <v-tabs-window-item value="two">
          <v-card>
            <v-row>
              <v-col>
                <v-card-item>
                  <v-card-title>It always seems impossible until it’s done.</v-card-title>
                </v-card-item>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="pa-4 py-5">
                      <div>
                        <div v-if="finishedProjects.length > 0">
                          <div v-for="project in finishedProjects" :key="project.id" class="mb-4">
                            <!-- project Item -->
                            <div class="d-flex justify-space-between align-center">
                              <!-- Left Side: Description and Status -->
                              <div>
                                <h3 class="text-h6 mb-2">
                                  <strong>{{ project.description }}</strong>
                                </h3>
                                <p class="mb-0"><strong>Status:</strong> {{ project.status }}</p>
                              </div>

                              <!-- Right Side: Image -->
                              <v-img
                                v-if="project.image_url"
                                :src="project.image_url"
                                height="150"
                                width="150"
                                class="ml-4"
                                aspect-ratio="1"
                              ></v-img>
                              <v-card-actions>
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

                            <!-- Divider -->
                            <v-divider
                              :thickness="2"
                              class="border-opacity-100 mt-3"
                              color="info"
                            ></v-divider>
                          </div>
                        </div>
                        <div v-else>
                          <p>No finished projects available.</p>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
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
