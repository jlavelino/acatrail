<script setup>
import { onMounted, ref } from 'vue'
import { useAssignmentsStore } from '@/stores/assignments'
import AssignmentFormDialog from './AssignmentFormDialog.vue'

const assignmentsStore = useAssignmentsStore()

//Load Variables
const itemData = ref(null)
const isDialogVisible = ref(false)

// Add Assignments
const onAdd = () => {
  isDialogVisible.value = true
}

onMounted(async () => {
  if (assignmentsStore.assignments.length == 0) await assignmentsStore.getAssignments()
})
// for the tabs part
const tab = ref('one')

// for the modal visibility
const showModal = ref(false)
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
              <v-col class="pt-10"
                ><button class="create-new-btn rounded-pill" @click="onAdd">
                  <i class="mdi mdi-plus"></i> Create Assignment
                </button></v-col
              >
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
                      </div>
                      <div>
                        <v-card-actions style="display: flex; justify-content: flex-end">
                          <v-btn icon variant="elevated" density="comfortable" color="black">
                            <v-icon size="20">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn icon variant="elevated" density="comfortable" color="red">
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
</template>

<style scoped>
/* WELCOME PAGE */
.create-new-btn {
  background: #095bea;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Poppins';
}

/* DIALOG */

.add-task-dialog {
  border-radius: 30px; /* Round corners */
  border: 2px solid #095bea; /* Adjust color as needed */
  overflow: hidden;
  background-color: #f7f9fa; /* Light background for contrast */
}

.cancel-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}

.save-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  border: 2px solid #0097a7; /* Adjust color as needed */
}

/* END DIALOG */
</style>
