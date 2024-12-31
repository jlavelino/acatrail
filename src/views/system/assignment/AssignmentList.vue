<script setup>
import { onMounted, ref } from 'vue'
import { useAssignmentsStore } from '@/stores/assignments'
import AssignmentFormDialog from './AssignmentFormDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const assignmentsStore = useAssignmentsStore()

// Load Variables
const itemData = ref(null)
const isDialogVisible = ref(false)
const deleteId = ref(null)
const isConfirmDeleteDialog = ref(false) // Added this ref

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
  isConfirmDeleteDialog.value = true // Set dialog visibility to true
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
    isConfirmDeleteDialog.value = false // Hide dialog after successful deletion
  } catch (err) {
    console.error('Error deleting assignment:', err.message)
  }
}

onMounted(async () => {
  if (assignmentsStore.assignments.length === 0) {
    await assignmentsStore.getAssignments()
  }
})

// For the tabs part
const tab = ref('one')
</script>

<template>
  <v-card>
    <v-tabs v-model="tab" class="auth-background tabs-head">
      <v-tab value="one">Your ASSIGNMENT</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-card class="mx-auto" max-width="100%" hover>
            <v-row>
              <v-col>
                <v-card-item>
                  <v-card-title style="font-family: 'Poppins'; color: #095bea">
                    <b>To Do Assignment </b>
                    <v-icon
                      class="mdi mdi-alert-octagon"
                      style="font-size: 25px"
                      color="red-darken-3"
                    ></v-icon>
                  </v-card-title>
                  <v-card-subtitle>
                    Plan, Prioritize, and Complete your Assignment
                  </v-card-subtitle>
                </v-card-item></v-col
              >
              <v-col class="pt-10">
                <button class="create-new-btn rounded-pill" @click="onAdd">
                  <i class="mdi mdi-plus"></i> Create Assignment
                </button>
              </v-col>
            </v-row>

            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  class="pa-4"
                  v-for="assignment in assignmentsStore.assignments"
                  :key="assignment.id"
                >
                  <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>
                  <v-card class="mb-5 custom-border" elevation="0" outlined>
                    <v-card-text class="d-flex justify-space-between align-center">
                      <div>
                        <div v-if="assignment.data && Object.keys(assignment.data).length">
                          <ul>
                            <li v-for="(value, key) in assignment.data" :key="key">
                              <span class="font-weight-bold">{{ key }}</span
                              >: {{ value }}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <strong>Description: </strong>{{ assignment.description || 'N/A' }}
                        </div>
                        <div>
                          <strong>Additional Notes:</strong>
                          {{ assignment.additional_notes || 'N/A' }}
                        </div>
                        <div><strong>Due Date:</strong> {{ assignment.due_date || 'N/A' }}</div>

                        <!-- Image -->
                        <v-img
                          v-if="assignment.image_url"
                          :src="assignment.image_url"
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
