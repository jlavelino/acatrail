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

// Progress calculation
const completionPercent = (assignment) => {
  if (!assignment.checklist || !assignment.checklist.length) return 0
  const checked = assignment.checklist.filter((c) => c.checked).length
  return Math.round((checked / assignment.checklist.length) * 100)
}

// Auto-save checklist on change
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
  <v-card flat>
    <!-- Header Section -->
    <v-card class="pa-3 header-card" flat>
      <v-row align="center" justify="space-between">
        <v-col cols="7">
          <div class="header-title">Stay on Track</div>
          <v-tabs v-model="tab" grow>
            <v-tab value="one">
              TO DO ASSIGNMENT
              <span class="tab-count to-do">[ {{ activeAssignments.length }} ]</span>
            </v-tab>
            <v-tab value="two">
              FINISHED ASSIGNMENT
              <span class="tab-count finished">[ {{ finishedAssignments.length }} ]</span>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="5" class="d-flex justify-end align-center">
          <v-btn class="primary rounded-pill" @click="onAdd">
            <v-icon left>mdi-plus</v-icon> CREATE ASSIGNMENT
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <!-- To Do Assignments Tab -->
        <v-tabs-window-item value="one">
          <v-row justify="center">
            <v-col
              cols="12"
              sm="6"
              md="6"
              v-for="assignment in activeAssignments"
              :key="assignment.id"
              class="d-flex justify-center"
            >
              <v-card class="modern-assignment-card" elevation="2" max-width="410">
                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="orange" size="29" class="me-2">mdi-notebook-outline</v-icon>
                      <span class="modern-assignment-title">Assignment</span>
                    </div>

                    <!-- Checklist checkboxes -->
                    <div
                      v-if="assignment.checklist && assignment.checklist.length"
                      class="assignment-checklist mb-2"
                    >
                      <v-checkbox
                        v-for="(item, idx) in assignment.checklist"
                        :key="idx"
                        :model-value="item.checked"
                        :label="item.label"
                        color="success"
                        density="compact"
                        hide-details
                        @update:model-value="(val) => onChecklistChange(assignment, idx, val)"
                      />
                    </div>

                    <!-- Progress bar -->
                    <div class="progress-row d-flex align-center mb-2">
                      <v-progress-linear
                        :model-value="completionPercent(assignment)"
                        color="green"
                        height="10"
                        rounded
                        bg-color="#e6f7ed"
                        style="flex: 1; max-width: 240px; border-radius: 6px"
                      />
                      <span
                        class="assignment-percent ms-3"
                        style="font-size: 1.1em; font-weight: 700; color: #18b156"
                      >
                        {{ completionPercent(assignment) }}%
                      </span>
                    </div>

                    <div class="mb-3 d-flex align-center">
                      <span
                        class="status-chip"
                        :class="{
                          progress: assignment.status !== 'finished',
                          finished: assignment.status === 'finished',
                        }"
                      >
                        {{ assignment.status === 'finished' ? 'FINISHED' : 'IN PROGRESS' }}
                      </span>
                      <span class="ms-2" style="font-size: 1.13em">{{
                        assignment.description
                      }}</span>
                    </div>
                    <div class="modern-assignment-detail">
                      <strong>Notes:</strong> {{ assignment.additional_notes }}
                    </div>
                    <div class="modern-assignment-detail">
                      <strong>Due:</strong> {{ assignment.due_date }} • {{ assignment.due_time }}
                    </div>
                    <div class="btn-group mt-5">
                      <v-btn
                        color="success"
                        class="rounded-lg modern-btn me-2"
                        height="46"
                        large
                        @click="onFinish(assignment.id)"
                        :disabled="assignment.status === 'finished'"
                      >
                        ✔ FINISH
                      </v-btn>
                      <v-btn
                        color="primary"
                        class="rounded-lg modern-btn me-2"
                        height="46"
                        dark
                        large
                        @click="onUpdate(assignment)"
                        :disabled="assignment.status === 'finished'"
                      >
                        <v-icon left>mdi-pencil</v-icon>EDIT
                      </v-btn>
                      <v-btn
                        color="red"
                        class="rounded-lg modern-btn"
                        height="46"
                        dark
                        large
                        @click="onDelete(assignment.id)"
                      >
                        <v-icon left>mdi-delete</v-icon>DELETE
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-tabs-window-item>

        <!-- Finished Assignments Tab -->
        <v-tabs-window-item value="two">
          <v-row justify="center">
            <v-col
              cols="12"
              sm="6"
              md="6"
              v-for="assignment in finishedAssignments"
              :key="assignment.id"
              class="d-flex justify-center"
            >
              <v-card class="modern-assignment-card" elevation="2" max-width="410">
                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="orange" size="29" class="me-2">mdi-notebook-outline</v-icon>
                      <span class="modern-assignment-title">Assignment</span>
                    </div>

                    <!-- Disabled checkboxes for finished -->
                    <div
                      v-if="assignment.checklist && assignment.checklist.length"
                      class="assignment-checklist mb-2"
                    >
                      <v-checkbox
                        v-for="(item, idx) in assignment.checklist"
                        :key="idx"
                        v-model="item.checked"
                        :label="item.label"
                        color="success"
                        density="compact"
                        hide-details
                        disabled
                      />
                    </div>

                    <!-- Progress bar (darker green for finished) -->
                    <div class="progress-row d-flex align-center mb-2">
                      <v-progress-linear
                        :model-value="completionPercent(assignment)"
                        color="#199e38"
                        height="10"
                        rounded
                        bg-color="#d0e8d4"
                        style="flex: 1; max-width: 240px; border-radius: 6px"
                        class="finished-progress"
                      />
                      <span
                        class="assignment-percent"
                        style="font-size: 1.15em; font-weight: 700; min-width: 38px; color: #189e38"
                      >
                        {{ completionPercent(assignment) }}%
                      </span>
                    </div>

                    <div class="mb-3 d-flex align-center">
                      <span class="status-chip finished">FINISHED</span>
                      <span class="ms-2" style="font-size: 1.13em">{{
                        assignment.description
                      }}</span>
                    </div>
                    <div class="modern-assignment-detail">
                      <strong>Notes:</strong> {{ assignment.additional_notes }}
                    </div>
                    <div class="modern-assignment-detail">
                      <strong>Due:</strong> {{ assignment.due_date }} • {{ assignment.due_time }}
                    </div>
                    <div class="btn-group mt-5">
                      <v-btn
                        color="success"
                        class="rounded-lg modern-btn me-2"
                        height="46"
                        large
                        disabled
                      >
                        ✔ FINISH
                      </v-btn>
                      <v-btn
                        color="primary"
                        class="rounded-lg modern-btn me-2"
                        height="46"
                        dark
                        large
                        disabled
                      >
                        <v-icon left>mdi-pencil</v-icon>EDIT
                      </v-btn>
                      <v-btn
                        color="red"
                        class="rounded-lg modern-btn"
                        height="46"
                        dark
                        large
                        @click="onDelete(assignment.id)"
                      >
                        <v-icon left>mdi-delete</v-icon>DELETE
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
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
.finished-progress .v-progress-linear__determinate {
  background-color: #199e38 !important;
}
.finished-progress {
  opacity: 1 !important;
}
.progress-row {
  margin-bottom: 7px;
  margin-top: 1px;
}
.assignment-percent {
  font-weight: 700;
  font-size: 1.12em;
  color: #19b563;
  letter-spacing: 0.01em;
  margin-left: 9px;
}
.modern-assignment-card {
  background: linear-gradient(115deg, #f5fcff 80%, #e8f0fc 100%);
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(40, 80, 140, 0.08);
  padding: 30px 25px 25px 30px;
  margin: 20px auto;
  min-width: 330px;
}
.modern-assignment-title {
  font-size: 1.45em;
  font-weight: 700;
  color: #195abc;
  letter-spacing: 0.04em;
}
.assignment-checklist {
  margin-top: 2px;
  margin-bottom: 14px;
}
.status-chip {
  font-size: 1em;
  font-weight: 700;
  padding: 4px 18px;
  border-radius: 10px;
  letter-spacing: 1px;
  background: #d5e7fb;
  color: #348ada;
  margin-right: 12px;
  margin-top: 0px;
}
.status-chip.progress {
  background: #d5e7fb;
  color: #348ada;
}
.status-chip.finished {
  background: #b3f2c6;
  color: #169754;
}
.btn-group {
  display: flex;
  flex-wrap: nowrap;
  gap: 13px;
  margin-top: 18px;
}
.modern-btn {
  font-weight: 600;
  font-size: 1.06em;
  min-width: 90px;
  text-transform: none;
}
.header-card {
  background: linear-gradient(90deg, #f5fcff 80%, #dbeafe 100%);
  border-radius: 18px;
  box-shadow: 0 2px 8px 0 rgba(40, 80, 140, 0.07);
  margin-bottom: 18px;
}
.header-title {
  color: #095bea;
  font-weight: 700;
  font-size: 1.4em;
}
.tab-count {
  margin-left: 11px;
  font-weight: 700;
  font-size: 0.98em;
}
.tab-count.to-do {
  color: #1976d2;
}
.tab-count.finished {
  color: #21ba45;
}
.v-btn.primary {
  background-color: #095bea !important;
  color: #fff !important;
}
@media (max-width: 600px) {
  .btn-group {
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
  }
}
</style>
