<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import ProjectFormDialog from './ProjectFormDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const projectsStore = useProjectsStore()
const tab = ref('one') // ← THIS IS *REQUIRED*

const itemData = ref(null)
const isDialogVisible = ref(false)
const deleteId = ref(null)
const isConfirmDeleteDialog = ref(false)

const onAdd = () => {
  itemData.value = null
  isDialogVisible.value = true
}
const onUpdate = (project) => {
  itemData.value = project
  isDialogVisible.value = true
}
const onDelete = (id) => {
  deleteId.value = id
  isConfirmDeleteDialog.value = true
}
const onConfirmDelete = async () => {
  try {
    const { error } = await projectsStore.deleteProjects(deleteId.value)
    if (error) {
      console.error(error.message)
      return
    }
    await projectsStore.getProjects()
    isConfirmDeleteDialog.value = false
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
    await projectsStore.updateProjects({ id, status: 'finished' })
    await projectsStore.getProjects()
  } catch (err) {
    console.error('Error finishing project:', err.message)
  }
}
const activeProjects = computed(() => projectsStore.projects.filter((p) => p.status !== 'finished'))
const finishedProjects = computed(() =>
  projectsStore.projects.filter((p) => p.status === 'finished'),
)

// Returns percent complete based on checked boxes
const completionPercent = (project) => {
  if (!project.checklist || !project.checklist.length) return 0
  const checked = project.checklist.filter((c) => c.checked).length
  return Math.round((checked / project.checklist.length) * 100)
}
const onChecklistChange = async (project, idx, val) => {
  // Update locally, then push to backend
  project.checklist[idx].checked = val
  await projectsStore.updateProjects({
    ...project,
    checklist: project.checklist,
  })
  // Optionally: reload projects or update in place
}
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
              TO DO PROJECT
              <span class="tab-count to-do">[ {{ activeProjects.length }} ]</span>
            </v-tab>
            <v-tab value="two">
              FINISHED PROJECT
              <span class="tab-count finished">[ {{ finishedProjects.length }} ]</span>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="5" class="d-flex justify-end align-center">
          <v-btn class="primary rounded-pill" @click="onAdd">
            <v-icon left>mdi-plus</v-icon> CREATE PROJECT
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <!-- TO DO PROJECTS SECTION -->
        <v-tabs-window-item value="one">
          <v-row justify="center">
            <v-col
              cols="12"
              sm="6"
              md="6"
              v-for="project in activeProjects"
              :key="project.id"
              class="d-flex justify-center"
            >
              <v-card class="modern-project-card" elevation="2" max-width="410">
                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="orange" size="29" class="me-2"
                        >mdi-lightbulb-on-outline</v-icon
                      >
                      <span class="modern-project-title">Project</span>
                    </div>
                    <!-- Checklist checkboxes... -->
                    <div
                      v-if="project.checklist && project.checklist.length"
                      class="project-checklist mb-2"
                    >
                      <v-checkbox
                        v-for="(item, idx) in project.checklist"
                        :key="idx"
                        :model-value="item.checked"
                        :label="item.label"
                        color="success"
                        density="compact"
                        hide-details
                        @update:model-value="(val) => onChecklistChange(project, idx, val)"
                      />
                    </div>

                    <!-- Progress bar row visual -->
                    <div class="progress-row d-flex align-center mb-2">
                      <v-progress-linear
                        :model-value="completionPercent(project)"
                        color="green"
                        height="10"
                        rounded
                        bg-color="#e6f7ed"
                        style="flex: 1; max-width: 240px; border-radius: 6px"
                      />
                      <span
                        class="project-percent ms-3"
                        style="font-size: 1.1em; font-weight: 700; color: #18b156"
                      >
                        {{ completionPercent(project) }}%
                      </span>
                    </div>

                    <div class="mb-3 d-flex align-center">
                      <span
                        class="status-chip"
                        :class="{
                          progress: project.status !== 'finished',
                          finished: project.status === 'finished',
                        }"
                      >
                        {{ project.status === 'finished' ? 'FINISHED' : 'IN PROGRESS' }}
                      </span>
                      <span class="ms-2" style="font-size: 1.13em">{{ project.description }}</span>
                    </div>
                    <div class="modern-project-detail">
                      <strong>Notes:</strong> {{ project.additional_notes }}
                    </div>
                    <div class="modern-project-detail">
                      <strong>Due:</strong> {{ project.due_date }} • {{ project.due_time }}
                    </div>
                    <div class="btn-group mt-5">
                      <v-btn
                        color="success"
                        class="rounded-lg modern-btn me-2"
                        height="46"
                        large
                        @click="onFinish(project.id)"
                        :disabled="project.status === 'finished'"
                      >
                        ✔ FINISH
                      </v-btn>
                      <v-btn
                        color="primary"
                        class="rounded-lg modern-btn me-2"
                        height="46"
                        dark
                        large
                        @click="onUpdate(project)"
                      >
                        <v-icon left>mdi-pencil</v-icon>EDIT
                      </v-btn>
                      <v-btn
                        color="red"
                        class="rounded-lg modern-btn"
                        height="46"
                        dark
                        large
                        @click="onDelete(project.id)"
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

        <!-- FINISHED PROJECTS SECTION -->
        <v-tabs-window-item value="two">
          <v-row justify="center">
            <v-col
              cols="12"
              sm="6"
              md="6"
              v-for="project in finishedProjects"
              :key="project.id"
              class="d-flex justify-center"
            >
              <v-card class="modern-project-card" elevation="2" max-width="410">
                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="orange" size="29" class="me-2"
                        >mdi-lightbulb-on-outline</v-icon
                      >
                      <span class="modern-project-title">Project</span>
                    </div>
                    <div
                      v-if="project.checklist && project.checklist.length"
                      class="project-checklist mb-2"
                    >
                      <v-checkbox
                        v-for="(item, idx) in project.checklist"
                        :key="idx"
                        v-model="item.checked"
                        :label="item.label"
                        color="success"
                        density="compact"
                        hide-details
                        disabled
                      />
                    </div>
                    <div class="progress-row d-flex align-center mb-2">
                      <v-progress-linear
                        :model-value="completionPercent(project)"
                        color="#1eab24"
                        height="10"
                        rounded
                        style="flex: 1; max-width: 240px; border-radius: 6px"
                        class="finished-progress"
                      />

                      <span
                        class="project-percent"
                        style="font-size: 1.15em; font-weight: 700; min-width: 38px; color: #24af53"
                      >
                        {{ completionPercent(project) }}%
                      </span>
                    </div>

                    <div class="mb-3 d-flex align-center">
                      <span class="status-chip finished">FINISHED</span>
                      <span class="ms-2" style="font-size: 1.13em">{{ project.description }}</span>
                    </div>
                    <div class="modern-project-detail">
                      <strong>Notes:</strong> {{ project.additional_notes }}
                    </div>
                    <div class="modern-project-detail">
                      <strong>Due:</strong> {{ project.due_date }} • {{ project.due_time }}
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
                        @click="onUpdate(project)"
                        :disabled="project.status === 'finished'"
                      >
                        <v-icon left>mdi-pencil</v-icon>EDIT
                      </v-btn>

                      <v-btn
                        color="red"
                        class="rounded-lg modern-btn"
                        height="46"
                        dark
                        large
                        @click="onDelete(project.id)"
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
.progress-row {
  margin-bottom: 7px;
  margin-top: 1px;
}
.project-percent {
  font-weight: 700;
  font-size: 1.12em;
  color: #19b563;
  letter-spacing: 0.01em;
  margin-left: 9px;
}

.modern-project-card {
  background: linear-gradient(115deg, #f5fcff 80%, #e8f0fc 100%);
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(40, 80, 140, 0.08);
  padding: 30px 25px 25px 30px;
  margin: 20px auto;
  min-width: 330px;
}
.modern-project-title {
  font-size: 1.45em;
  font-weight: 700;
  color: #195abc;
  letter-spacing: 0.04em;
}
.progress-row {
  margin-bottom: 8px;
  margin-top: -10px;
}
.project-percent {
  font-weight: 600;
  font-size: 1em;
  color: #15a753;
  min-width: 38px;
  text-align: right;
  letter-spacing: 0.01em;
}
.project-checklist {
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
