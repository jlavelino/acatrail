<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAssignmentsStore } from '@/stores/assignments'
import AssignmentFormDialog from './AssignmentFormDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const assignmentsStore = useAssignmentsStore()
const tab = ref('one')

const itemData = ref(null)
const isDialogVisible = ref(false)
const deleteId = ref(null)
const isConfirmDeleteDialog = ref(false)

const onAdd = () => {
  itemData.value = null
  isDialogVisible.value = true
}
const onUpdate = (assignment) => {
  itemData.value = assignment
  isDialogVisible.value = true
}
const onDelete = (id) => {
  deleteId.value = id
  isConfirmDeleteDialog.value = true
}
const onConfirmDelete = async () => {
  try {
    const { error } = await assignmentsStore.deleteAssignments(deleteId.value)
    if (error) {
      console.error(error.message)
      return
    }
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
    await assignmentsStore.updateAssignments({ id, status: 'finished' })
    await assignmentsStore.getAssignments()
  } catch (err) {
    console.error('Error finishing assignment:', err.message)
  }
}

const completionPercent = (assignment) => {
  if (!assignment.checklist || !assignment.checklist.length) return 0
  const checked = assignment.checklist.filter((c) => c.checked).length
  return Math.round((checked / assignment.checklist.length) * 100)
}
const onChecklistChange = async (assignment, idx, val) => {
  assignment.checklist[idx].checked = val
  await assignmentsStore.updateAssignments({
    ...assignment,
    checklist: assignment.checklist,
  })
}
const activeAssignments = computed(() =>
  assignmentsStore.assignments.filter((a) => a.status !== 'finished'),
)
const finishedAssignments = computed(() =>
  assignmentsStore.assignments.filter((a) => a.status === 'finished'),
)
</script>

<template>
  <v-container fluid class="background" style="min-height: 100vh">
    <v-card class="pa-4 header-card" flat>
      <v-row align="center" justify="space-between" no-gutters>
        <v-col cols="12" md="8">
          <div class="header-title mb-3">Stay on Track</div>
          <v-tabs v-model="tab" color="primary" align-tabs="start" class="custom-tabs">
            <v-tab value="one" class="custom-tab">
              <span class="tab-label">TO DO ASSIGNMENT</span>
              <v-chip size="small" class="ml-2 tab-chip" color="blue-darken-2" variant="flat">
                {{ activeAssignments.length }}
              </v-chip>
            </v-tab>
            <v-tab value="two" class="custom-tab">
              <span class="tab-label">FINISHED ASSIGNMENT</span>
              <v-chip size="small" class="ml-2 tab-chip" color="success" variant="flat">
                {{ finishedAssignments.length }}
              </v-chip>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-end align-center mt-3 mt-md-0">
          <v-btn class="create-btn" size="large" elevation="2" @click="onAdd">
            <v-icon left>mdi-plus</v-icon>
            CREATE ASSIGNMENT
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-tabs-window v-model="tab" class="mt-6">
      <v-tabs-window-item value="one">
        <v-row :justify="activeAssignments.length === 1 ? 'center' : 'start'">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="assignment in activeAssignments"
            :key="assignment.id"
          >
            <v-card class="modern-assignment-card" elevation="2">
              <v-card-text>
                <div class="d-flex align-center mb-3">
                  <v-icon color="orange" size="32" class="me-2">mdi-notebook-outline</v-icon>
                  <div class="flex-grow-1">
                    <div class="text-overline text-muted mb-0">Assignment</div>
                    <div class="assignment-title">{{ assignment.description }}</div>
                  </div>
                  <v-chip
                    :color="assignment.status === 'finished' ? 'success' : 'primary'"
                    size="small"
                    label
                  >
                    {{ assignment.status === 'finished' ? 'FINISHED' : 'IN PROGRESS' }}
                  </v-chip>
                </div>
                <div
                  v-if="!assignment.checklist || assignment.checklist.length === 0"
                  class="no-checklist-msg mb-3"
                >
                  <v-icon color="grey-darken-1" size="small">mdi-information-outline</v-icon>
                  <span class="text-caption text-muted ml-2"
                    >No steps defined for this assignment</span
                  >
                </div>
                <div v-else class="checklist-section mb-3">
                  <div class="text-caption font-weight-bold mb-2 text-primary">
                    <v-icon size="small" color="primary">mdi-format-list-checks</v-icon>
                    Tasks ({{ assignment.checklist.filter((c) => c.checked).length }}/{{
                      assignment.checklist.length
                    }})
                  </div>
                  <v-checkbox
                    v-for="(item, idx) in assignment.checklist"
                    :key="idx"
                    :model-value="item.checked"
                    :label="item.label"
                    color="success"
                    density="compact"
                    hide-details
                    class="checklist-item"
                    @update:model-value="(val) => onChecklistChange(assignment, idx, val)"
                  />
                </div>
                <div class="progress-section mb-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-caption font-weight-bold text-grey-darken-2">Progress</span>
                    <span class="progress-percent">{{ completionPercent(assignment) }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="completionPercent(assignment)"
                    color="success"
                    height="12"
                    rounded
                    bg-color="#e8f5e9"
                  />
                </div>
                <v-divider class="my-3"></v-divider>
                <div class="details-section">
                  <div class="detail-item mb-2">
                    <v-icon size="small" color="grey-darken-1">mdi-text-box-outline</v-icon>
                    <span class="text-caption ml-2"
                      ><strong>Notes:</strong> {{ assignment.additional_notes }}</span
                    >
                  </div>
                  <div class="detail-item">
                    <v-icon size="small" color="grey-darken-1">mdi-calendar-clock</v-icon>
                    <span class="text-caption ml-2"
                      ><strong>Due:</strong> {{ assignment.due_date }} at
                      {{ assignment.due_time }}</span
                    >
                  </div>
                </div>
                <div class="d-flex justify-end gap-2 mt-4">
                  <v-btn
                    size="small"
                    color="success"
                    variant="elevated"
                    :disabled="assignment.status === 'finished'"
                    @click="onFinish(assignment.id)"
                  >
                    <v-icon left size="small">mdi-check</v-icon>Finish
                  </v-btn>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="elevated"
                    :disabled="assignment.status === 'finished'"
                    @click="onUpdate(assignment)"
                  >
                    <v-icon left size="small">mdi-pencil</v-icon>Edit
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="elevated"
                    @click="onDelete(assignment.id)"
                  >
                    <v-icon left size="small">mdi-delete</v-icon>Delete
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>
      <v-tabs-window-item value="two">
        <v-row :justify="finishedAssignments.length === 1 ? 'center' : 'start'">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="assignment in finishedAssignments"
            :key="assignment.id"
          >
            <v-card class="modern-assignment-card finished-card" elevation="2">
              <v-card-text>
                <div class="d-flex align-center mb-3">
                  <v-icon color="success" size="32" class="me-2">mdi-check-circle</v-icon>
                  <div class="flex-grow-1">
                    <div class="text-overline text-muted mb-0">Assignment</div>
                    <div class="assignment-title">{{ assignment.description }}</div>
                  </div>
                  <v-chip color="success" size="small" label>FINISHED</v-chip>
                </div>
                <div
                  v-if="assignment.checklist && assignment.checklist.length"
                  class="checklist-section mb-3 finished-checklist"
                >
                  <div class="text-caption font-weight-bold mb-2 text-success">
                    <v-icon size="small" color="success">mdi-check-all</v-icon>
                    All Tasks Completed ({{ assignment.checklist.length }}/{{
                      assignment.checklist.length
                    }})
                  </div>
                  <v-checkbox
                    v-for="(item, idx) in assignment.checklist"
                    :key="idx"
                    v-model="item.checked"
                    :label="item.label"
                    color="success"
                    density="compact"
                    hide-details
                    disabled
                    class="checklist-item"
                  />
                </div>
                <div class="progress-section mb-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-caption font-weight-bold text-success">Completed!</span>
                    <span class="progress-percent text-success"
                      >{{ completionPercent(assignment) }}%</span
                    >
                  </div>
                  <v-progress-linear
                    :model-value="completionPercent(assignment)"
                    color="success"
                    height="12"
                    rounded
                    bg-color="#e8f5e9"
                  />
                </div>
                <v-divider class="my-3"></v-divider>
                <div class="details-section">
                  <div class="detail-item mb-2">
                    <v-icon size="small" color="grey-darken-1">mdi-text-box-outline</v-icon>
                    <span class="text-caption ml-2"
                      ><strong>Notes:</strong> {{ assignment.additional_notes }}</span
                    >
                  </div>
                  <div class="detail-item">
                    <v-icon size="small" color="grey-darken-1">mdi-calendar-check</v-icon>
                    <span class="text-caption ml-2"
                      ><strong>Completed:</strong> {{ assignment.due_date }}</span
                    >
                  </div>
                </div>
                <div class="d-flex justify-end gap-2 mt-4">
                  <v-btn size="small" color="success" variant="elevated" disabled>
                    <v-icon left size="small">mdi-check</v-icon>Finish
                  </v-btn>
                  <v-btn size="small" color="primary" variant="elevated" disabled>
                    <v-icon left size="small">mdi-pencil</v-icon>Edit
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="elevated"
                    @click="onDelete(assignment.id)"
                  >
                    <v-icon left size="small">mdi-delete</v-icon>Delete
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>

    <!-- Dialogs -->
    <AssignmentFormDialog v-model:is-dialog-visible="isDialogVisible" :item-data="itemData" />
    <ConfirmDialog
      v-model:is-dialog-visible="isConfirmDeleteDialog"
      title="Confirm Delete"
      text="Are you sure you want to delete this assignment?"
      @confirm="onConfirmDelete"
    />
  </v-container>
</template>

<style scoped>
.background {
  background: linear-gradient(90deg, #0b6623 0%, #1aae6f 100%);
  min-height: 100vh;
  padding: 24px;
}
.header-card {
  background: #004d25;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 24px;
  color: #fcd116;
}
.header-title {
  color: #fcd116;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: -0.5px;
}
.custom-tabs {
  background: transparent;
}
.custom-tab {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: none;
  padding: 0 24px;
  min-height: 48px;
}
.custom-tab.v-tab--selected {
  color: #fcd116 !important;
  border-bottom: 3px solid #fcd116;
  border-radius: 0;
}
.tab-label {
  font-weight: 600;
}
.tab-chip {
  font-weight: 700;
  min-width: 32px;
  height: 24px;
}
.create-btn {
  background: #fcd116 !important;
  color: #004d25 !important;
  font-weight: 700;
  padding: 0 24px !important;
  border-radius: 10px;
  text-transform: none;
  font-size: 0.95rem;
}
.create-btn:hover {
  background: #ffde42 !important;
  transform: translateY(-2px);
}
.modern-assignment-card {
  border-radius: 14px;
  background: #f5fbf7 !important;
  color: #1a1a1a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdcdc;
}
.modern-assignment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
.finished-card {
  background: #f1f8f4 !important;
  border: 1px solid #c8e6c9 !important;
}
.assignment-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #004d25;
  line-height: 1.3;
}
.text-muted {
  color: #757575;
}
.no-checklist-msg {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #fff3e0;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}
.checklist-section {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}
.finished-checklist {
  background: #f1f8f4;
  border: 1px solid #c8e6c9;
}
.progress-section {
  background: #fafafa;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}
.progress-percent {
  font-size: 1.15rem;
  font-weight: 700;
  color: #004d25;
}
.v-btn.primary {
  background-color: #fcd116 !important;
  color: #004d25 !important;
}
.v-btn.success {
  background-color: #004d25 !important;
  color: #ffffff !important;
}
.v-btn.error {
  background-color: #c62828 !important;
  color: #ffffff !important;
}
@media (max-width: 960px) {
  .header-title {
    font-size: 1.5rem;
  }
  .custom-tab {
    font-size: 0.8rem;
    padding: 0 12px;
  }
  .create-btn {
    width: 100%;
  }
}
.gap-2 {
  gap: 8px;
}
</style>
