<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import ProjectFormDialog from './ProjectFormDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const projectsStore = useProjectsStore()
const tab = ref('one')

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

const completionPercent = (project) => {
  if (!project.checklist || !project.checklist.length) return 0
  const checked = project.checklist.filter((c) => c.checked).length
  return Math.round((checked / project.checklist.length) * 100)
}

const onChecklistChange = async (project, idx, val) => {
  project.checklist[idx].checked = val
  await projectsStore.updateProjects({
    ...project,
    checklist: project.checklist,
  })
}
</script>

<template>
  <v-card flat>
    <!-- Enhanced Header Section -->
    <v-card class="pa-4 header-card" flat>
      <v-row align="center" justify="space-between" no-gutters>
        <v-col cols="12" md="8">
          <div class="header-title mb-3">Stay on Track</div>
          <v-tabs v-model="tab" color="primary" align-tabs="start" class="custom-tabs">
            <v-tab value="one" class="custom-tab">
              <span class="tab-label">TO DO PROJECT</span>
              <v-chip size="small" class="ml-2 tab-chip" color="blue-darken-2" variant="flat">
                {{ activeProjects.length }}
              </v-chip>
            </v-tab>
            <v-tab value="two" class="custom-tab">
              <span class="tab-label">FINISHED PROJECT</span>
              <v-chip size="small" class="ml-2 tab-chip" color="success" variant="flat">
                {{ finishedProjects.length }}
              </v-chip>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-end align-center mt-3 mt-md-0">
          <v-btn class="create-btn" size="large" elevation="2" @click="onAdd">
            <v-icon left>mdi-plus</v-icon>
            CREATE PROJECT
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <!-- TO DO PROJECTS TAB -->
        <v-tabs-window-item value="one">
          <v-row :justify="activeProjects.length === 1 ? 'center' : 'start'">
            <v-col cols="12" sm="6" md="4" v-for="project in activeProjects" :key="project.id">
              <v-card class="modern-project-card" elevation="2">
                <v-card-text>
                  <!-- Header with icon and title -->
                  <div class="d-flex align-center mb-3">
                    <v-icon color="orange" size="32" class="me-2">mdi-lightbulb-on-outline</v-icon>
                    <div class="flex-grow-1">
                      <div class="text-overline text-muted mb-0">Project</div>
                      <div class="project-title">{{ project.description }}</div>
                    </div>
                    <v-chip
                      :color="project.status === 'finished' ? 'success' : 'primary'"
                      size="small"
                      label
                    >
                      {{ project.status === 'finished' ? 'FINISHED' : 'IN PROGRESS' }}
                    </v-chip>
                  </div>

                  <!-- No Checklist Message -->
                  <div
                    v-if="!project.checklist || project.checklist.length === 0"
                    class="no-checklist-msg mb-3"
                  >
                    <v-icon color="grey-darken-1" size="small">mdi-information-outline</v-icon>
                    <span class="text-caption text-muted ml-2"
                      >No steps defined for this project</span
                    >
                  </div>

                  <!-- Checklist -->
                  <div v-else class="checklist-section mb-3">
                    <div class="text-caption font-weight-bold mb-2 text-primary">
                      <v-icon size="small" color="primary">mdi-format-list-checks</v-icon>
                      Tasks ({{ project.checklist.filter((c) => c.checked).length }}/{{
                        project.checklist.length
                      }})
                    </div>
                    <v-checkbox
                      v-for="(item, idx) in project.checklist"
                      :key="idx"
                      :model-value="item.checked"
                      :label="item.label"
                      color="success"
                      density="compact"
                      hide-details
                      class="checklist-item"
                      @update:model-value="(val) => onChecklistChange(project, idx, val)"
                    />
                  </div>

                  <!-- Progress Section -->
                  <div class="progress-section mb-3">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-caption font-weight-bold text-grey-darken-2">Progress</span>
                      <span class="progress-percent">{{ completionPercent(project) }}%</span>
                    </div>
                    <v-progress-linear
                      :model-value="completionPercent(project)"
                      color="success"
                      height="12"
                      rounded
                      bg-color="#e8f5e9"
                    />
                  </div>

                  <!-- Details -->
                  <v-divider class="my-3"></v-divider>
                  <div class="details-section">
                    <div class="detail-item mb-2">
                      <v-icon size="small" color="grey-darken-1">mdi-text-box-outline</v-icon>
                      <span class="text-caption ml-2"
                        ><strong>Notes:</strong> {{ project.additional_notes }}</span
                      >
                    </div>
                    <div class="detail-item">
                      <v-icon size="small" color="grey-darken-1">mdi-calendar-clock</v-icon>
                      <span class="text-caption ml-2"
                        ><strong>Due:</strong> {{ project.due_date }} at
                        {{ project.due_time }}</span
                      >
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="d-flex justify-end gap-2 mt-4">
                    <v-btn
                      size="small"
                      color="success"
                      variant="elevated"
                      :disabled="project.status === 'finished'"
                      @click="onFinish(project.id)"
                    >
                      <v-icon left size="small">mdi-check</v-icon>Finish
                    </v-btn>
                    <v-btn
                      size="small"
                      color="primary"
                      variant="elevated"
                      :disabled="project.status === 'finished'"
                      @click="onUpdate(project)"
                    >
                      <v-icon left size="small">mdi-pencil</v-icon>Edit
                    </v-btn>
                    <v-btn
                      size="small"
                      color="error"
                      variant="elevated"
                      @click="onDelete(project.id)"
                    >
                      <v-icon left size="small">mdi-delete</v-icon>Delete
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tabs-window-item>

        <!-- FINISHED PROJECTS TAB -->
        <v-tabs-window-item value="two">
          <v-row :justify="finishedProjects.length === 1 ? 'center' : 'start'">
            <v-col cols="12" sm="6" md="4" v-for="project in finishedProjects" :key="project.id">
              <v-card class="modern-project-card finished-card" elevation="2">
                <v-card-text>
                  <!-- Header -->
                  <div class="d-flex align-center mb-3">
                    <v-icon color="success" size="32" class="me-2">mdi-check-circle</v-icon>
                    <div class="flex-grow-1">
                      <div class="text-overline text-muted mb-0">Project</div>
                      <div class="project-title">{{ project.description }}</div>
                    </div>
                    <v-chip color="success" size="small" label>FINISHED</v-chip>
                  </div>

                  <!-- Disabled Checklist -->
                  <div
                    v-if="project.checklist && project.checklist.length"
                    class="checklist-section mb-3 finished-checklist"
                  >
                    <div class="text-caption font-weight-bold mb-2 text-success">
                      <v-icon size="small" color="success">mdi-check-all</v-icon>
                      All Tasks Completed ({{ project.checklist.length }}/{{
                        project.checklist.length
                      }})
                    </div>
                    <v-checkbox
                      v-for="(item, idx) in project.checklist"
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

                  <!-- Progress (100%) -->
                  <div class="progress-section mb-3">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-caption font-weight-bold text-success">Completed!</span>
                      <span class="progress-percent text-success"
                        >{{ completionPercent(project) }}%</span
                      >
                    </div>
                    <v-progress-linear
                      :model-value="completionPercent(project)"
                      color="success"
                      height="12"
                      rounded
                      bg-color="#e8f5e9"
                    />
                  </div>

                  <!-- Details -->
                  <v-divider class="my-3"></v-divider>
                  <div class="details-section">
                    <div class="detail-item mb-2">
                      <v-icon size="small" color="grey-darken-1">mdi-text-box-outline</v-icon>
                      <span class="text-caption ml-2"
                        ><strong>Notes:</strong> {{ project.additional_notes }}</span
                      >
                    </div>
                    <div class="detail-item">
                      <v-icon size="small" color="grey-darken-1">mdi-calendar-check</v-icon>
                      <span class="text-caption ml-2"
                        ><strong>Completed:</strong> {{ project.due_date }}</span
                      >
                    </div>
                  </div>

                  <!-- Actions (Disabled) -->
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
                      @click="onDelete(project.id)"
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
    </v-card-text>
  </v-card>

  <ProjectFormDialog v-model:is-dialog-visible="isDialogVisible" :item-data="itemData" />
  <ConfirmDialog
    v-model:is-dialog-visible="isConfirmDeleteDialog"
    title="Confirm Delete"
    text="Are you sure you want to delete this project?"
    @confirm="onConfirmDelete"
  />
</template>

<style scoped>
/* Header Styles */
.header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  margin-bottom: 24px;
  color: white;
}

.header-title {
  color: white;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-tabs {
  background: transparent;
}

.custom-tab {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  text-transform: none;
  padding: 0 24px;
  min-height: 48px;
}

.custom-tab.v-tab--selected {
  color: white !important;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px 8px 0 0;
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
  background: white !important;
  color: #667eea !important;
  font-weight: 600;
  padding: 0 24px !important;
  border-radius: 12px;
  text-transform: none;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background: #f5f5f5 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

/* Card Styles */
.modern-project-card {
  border-radius: 16px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.modern-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.finished-card {
  background: linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%);
  opacity: 0.95;
}

.project-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a237e;
  line-height: 1.3;
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

.checklist-item {
  margin-bottom: -8px;
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
  color: #4caf50;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.text-muted {
  color: #757575;
}

.gap-2 {
  gap: 8px;
}

/* Responsive */
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
</style>
