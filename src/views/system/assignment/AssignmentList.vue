<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAssignmentsStore } from '@/stores/assignments'
import AssignmentFormDialog from './AssignmentFormDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const assignmentsStore = useAssignmentsStore()

// Load Variables
const itemData = ref(null)
const isDialogVisible = ref(false)
const deleteId = ref(null)
const isConfirmDeleteDialog = ref(false)

// Add Assignments
const onAdd = () => {
  itemData.value = null
  isDialogVisible.value = true
}

// Update Assignment
const onUpdate = (assignment) => {
  itemData.value = assignment
  isDialogVisible.value = true
}

// Trigger Delete Dialog
const onDelete = (id) => {
  deleteId.value = id
  isConfirmDeleteDialog.value = true
}

// Confirm Delete
const onConfirmDelete = async () => {
  try {
    const { error } = await assignmentsStore.deleteAssignments(deleteId.value)
    if (error) {
      console.error(error.message)
      return
    }
    // Refresh the assignments list
    await assignmentsStore.getAssignments()
    isConfirmDeleteDialog.value = false
  } catch (err) {
    console.error('Error deleting assignment:', err.message)
  }
}

onMounted(async () => {
  if (assignmentsStore.assignments.length === 0) {
    await assignmentsStore.getAssignments()
  }
})

const onFinish = async (id) => {
  try {
    const assignment = assignmentsStore.assignments.find((a) => a.id === id)
    if (assignment) {
      assignment.status = 'finished' // Update status
    }
  } catch (err) {
    console.error('Error finishing assignment:', err.message)
  }
}

const finishedAssignments = computed(() =>
  assignmentsStore.assignments.filter((assignment) => assignment.status === 'finished'),
)

const tab = ref('one')
</script>

<template>
  <v-card>
    <v-tabs v-model="tab" class="auth-background tabs-head">
      <v-tab value="one">
        <v-card-title style="font-family: 'Poppins'; color: #095bea">
          <b>To Do Assignment</b>
          <v-icon
            class="mdi mdi-note-minus-outline"
            style="font-size: 25px"
            color="red-darken-4"
          ></v-icon>
        </v-card-title>
      </v-tab>
      <v-tab value="two">
        <v-card-title style="font-family: 'Poppins'; color: #095bea">
          <b>Finished Assignment</b>
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
        <!-- To Do Assignments Tab -->
        <v-tabs-window-item value="one">
          <v-card class="mx-auto" max-width="100%" hover>
            <v-row>
              <v-col>
                <v-card-item>
                  <v-card-title>Stay on Track</v-card-title>
                </v-card-item>
              </v-col>
              <v-col class="pt-5">
                <button class="create-new-btn rounded-pill" @click="onAdd">
                  <i class="mdi mdi-plus"></i> Add Assignment
                </button>
              </v-col>
            </v-row>

            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  class="pa-4"
                  v-for="assignment in assignmentsStore.assignments.filter(
                    (a) => a.status !== 'finished',
                  )"
                  :key="assignment.id"
                >
                  <h3 class="text-h6">
                    <strong>Assignment</strong>
                    <v-icon class="mdi mdi-alert-circle-outline" color="orange"></v-icon>
                  </h3>
                  <v-col>
                    <v-btn
                      variant="elevated"
                      density="comfortable"
                      class="mt-2"
                      color="green"
                      @click="onFinish(assignment.id)"
                      style="color: white"
                    >
                      <i class="mdi mdi-check-circle"></i> Finish Assignment
                    </v-btn>
                  </v-col>
                  <v-card class="mb-5 custom-border" elevation="0" outlined>
                    <v-card-text class="d-flex justify-space-between align-center">
                      <div>
                        <h4><strong>Description:</strong> {{ assignment.description || 'N/A' }}</h4>
                        <h4>
                          <strong>Additional Notes:</strong>
                          {{ assignment.additional_notes || 'N/A' }}
                        </h4>
                        <h4><strong>Due Date:</strong> {{ assignment.due_date || 'N/A' }}</h4>
                        <h4><strong>Due Time:</strong> {{ assignment.due_time || 'N/A' }}</h4>
                      </div>
                      <v-img
                        v-if="assignment.image_url"
                        :src="assignment.image_url"
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
                          @click="onUpdate(assignment)"
                        >
                          <v-icon size="20">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="elevated"
                          density="comfortable"
                          color="red"
                          @click="onDelete(assignment.id)"
                        >
                          <v-icon size="20">mdi-delete</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <!-- Finished Assignments Tab -->
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
                        <div v-if="finishedAssignments.length > 0">
                          <div
                            v-for="assignment in finishedAssignments"
                            :key="assignment.id"
                            class="mb-4"
                          >
                            <!-- Assignment Item -->
                            <div class="d-flex justify-space-between align-center">
                              <!-- Left Side: Description and Status -->
                              <div>
                                <h3 class="text-h6 mb-2">
                                  <strong>{{ assignment.description }}</strong>
                                </h3>
                                <p class="mb-0"><strong>Status:</strong> {{ assignment.status }}</p>
                              </div>

                              <!-- Right Side: Image -->
                              <v-img
                                v-if="assignment.image_url"
                                :src="assignment.image_url"
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
                                  @click="onDelete(assignment.id)"
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
                          <p>No finished assignments available.</p>
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

  <AssignmentFormDialog
    v-model:is-dialog-visible="isDialogVisible"
    :item-data="itemData"
  ></AssignmentFormDialog>

  <ConfirmDialog
    v-model:is-dialog-visible="isConfirmDeleteDialog"
    title="Confirm Delete"
    text="Are you sure you want to delete this assignment?"
    @confirm="onConfirmDelete"
  ></ConfirmDialog>
</template>

<style scoped>
/* Styling */
.create-new-btn {
  background: #095bea;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Poppins';
}
</style>
