<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/navigation/SideNavigation.vue'
import ProjectFormDialog from './project/ProjectFormDialog.vue'
import AssignmentFormDialog from './assignment/AssignmentFormDialog.vue'
import { useProjectsStore } from '@/stores/projects'
import { useAssignmentsStore } from '@/stores/assignments'
import { ref, computed, onMounted } from 'vue'

const isDrawerVisible = ref(true)
const itemData = ref(null)
const isProjectDialogVisible = ref(false)
const isAssignmentDialogVisible = ref(false)

const projectsStore = useProjectsStore()
const assignmentsStore = useAssignmentsStore()

onMounted(async () => {
  await projectsStore.getProjects()
  await assignmentsStore.getAssignments()
})

const totalProjects = computed(() => projectsStore.projects.length)
const activeProjects = computed(
  () => projectsStore.projects.filter((p) => p.status !== 'finished').length,
)
const totalAssignments = computed(() => assignmentsStore.assignments.length)
const activeAssignments = computed(
  () => assignmentsStore.assignments.filter((a) => a.status !== 'finished').length,
)
const completionRate = computed(() => {
  const totalTasks = totalProjects.value + totalAssignments.value
  if (totalTasks === 0) return 0
  const completed =
    totalProjects.value - activeProjects.value + (totalAssignments.value - activeAssignments.value)
  return Math.round((completed / totalTasks) * 100)
})
const upcomingDeadlines = computed(() => {
  const all = [
    ...assignmentsStore.assignments
      .filter((a) => a.status !== 'finished')
      .map((a) => ({ ...a, type: 'Assignment' })),
    ...projectsStore.projects
      .filter((p) => p.status !== 'finished')
      .map((p) => ({ ...p, type: 'Project' })),
  ]
  return all
    .sort(
      (a, b) => new Date(`${a.due_date} ${a.due_time}`) - new Date(`${b.due_date} ${b.due_time}`),
    )
    .slice(0, 3)
})

const onAdd = () => {
  itemData.value = null
  isProjectDialogVisible.value = true
}
const onAddAssignment = () => {
  itemData.value = null
  isAssignmentDialogVisible.value = true
}
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
})
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
      <v-container fluid class="dashboard-container">
        <!-- Personalized Welcome Banner -->
        <v-row>
          <v-col cols="12">
            <v-card class="welcome-banner" elevation="0">
              <v-row align="center">
                <v-col cols="12" md="8">
                  <h1 class="display-1 font-weight-bold text-primary mb-2">{{ greeting }}! 👋</h1>
                  <p class="text-h6 text-muted">
                    Effortless academic management from schedule to success.
                  </p>
                  <div class="mt-3">
                    <v-chip color="primary" label class="mr-2">
                      <v-icon left small>mdi-calendar-today</v-icon>
                      {{
                        new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })
                      }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <v-img
                    src="/images/homepage.JPG"
                    alt="AcaTrail"
                    max-height="180"
                    contain
                    class="rounded-lg"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <!-- Quick Stats Cards -->
        <v-row class="mt-4">
          <v-col cols="12" sm="6" md="3">
            <v-card class="stats-card" elevation="3">
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-overline text-muted">Active Projects</div>
                    <div class="text-h3 font-weight-bold text-primary">{{ activeProjects }}</div>
                    <div class="text-caption">of {{ totalProjects }} total</div>
                  </div>
                  <v-avatar color="primary" size="56">
                    <v-icon size="32" color="white">mdi-briefcase-outline</v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="stats-card" elevation="3">
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-overline text-muted">Assignments</div>
                    <div class="text-h3 font-weight-bold" style="color: #ff5722">
                      {{ activeAssignments }}
                    </div>
                    <div class="text-caption">of {{ totalAssignments }} total</div>
                  </div>
                  <v-avatar color="deep-orange" size="56">
                    <v-icon size="32" color="white">mdi-notebook-outline</v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="stats-card" elevation="3">
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-overline text-muted">Completion Rate</div>
                    <div class="text-h3 font-weight-bold text-success">{{ completionRate }}%</div>
                    <div class="text-caption">Overall progress</div>
                  </div>
                  <v-avatar color="success" size="56">
                    <v-icon size="32" color="white">mdi-chart-line</v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="stats-card" elevation="3">
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-overline text-muted">Due Soon</div>
                    <div class="text-h3 font-weight-bold" style="color: #ffa726">
                      {{ upcomingDeadlines.length }}
                    </div>
                    <div class="text-caption">Next 3 deadlines</div>
                  </div>
                  <v-avatar color="orange" size="56">
                    <v-icon size="32" color="white">mdi-clock-alert-outline</v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- Main Content Cards -->
        <v-row class="mt-4">
          <!-- Upcoming Deadlines -->
          <v-col cols="12" md="6">
            <v-card class="content-card" elevation="2" height="100%">
              <v-card-title class="pb-2">
                <v-icon left color="deep-orange">mdi-alert-circle-outline</v-icon>
                Upcoming Deadlines
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div v-if="upcomingDeadlines.length > 0">
                  <div
                    v-for="item in upcomingDeadlines"
                    :key="item.id"
                    class="deadline-item mb-3"
                    style="cursor: pointer"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-bold">{{ item.description }}</div>
                        <div class="text-caption text-muted">
                          {{ item.type }} - {{ item.due_date }} at {{ item.due_time }}
                        </div>
                      </div>
                      <v-chip size="small" color="orange" label>Soon</v-chip>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-muted py-4">
                  <v-icon size="48" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
                  <div class="mt-2">All caught up!</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- Progress Overview -->
          <v-col cols="12" md="6">
            <v-card class="content-card" elevation="2" height="100%">
              <v-card-title class="pb-2">
                <v-icon left color="success">mdi-chart-arc</v-icon>
                Progress Overview
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="text-center py-6">
                <v-progress-circular
                  :model-value="completionRate"
                  :size="120"
                  :width="12"
                  color="success"
                  class="mb-4"
                >
                  <span class="text-h4 font-weight-bold">{{ completionRate }}%</span>
                </v-progress-circular>
                <div class="text-h6 font-weight-bold mb-2">Overall Completion</div>
                <div class="text-caption text-muted">
                  {{ totalProjects + totalAssignments - activeProjects - activeAssignments }} of
                  {{ totalProjects + totalAssignments }} tasks completed
                </div>
                <div class="mt-4">
                  <v-chip color="success" variant="tonal">
                    <v-icon left small>mdi-trending-up</v-icon>
                    Keep it up!
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- Quick Actions -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card class="quick-actions-card" elevation="2">
              <v-card-title>Quick Actions</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-btn color="primary" size="large" block class="mb-2" @click="onAdd">
                      <v-icon left>mdi-plus-circle</v-icon>
                      Create Project
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-btn
                      color="deep-orange"
                      size="large"
                      block
                      class="mb-2"
                      @click="onAddAssignment"
                    >
                      <v-icon left>mdi-notebook-plus</v-icon>
                      Add Assignment
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-btn color="info" size="large" block class="mb-2">
                      <v-icon left>mdi-calendar</v-icon>
                      View Calendar
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-btn color="success" size="large" block class="mb-2">
                      <v-icon left>mdi-chart-box</v-icon>
                      View Reports
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- Motivational Tip -->
        <v-row class="mt-4 mb-2">
          <v-col>
            <v-alert
              type="info"
              variant="tonal"
              border="start"
              border-color="primary"
              icon="mdi-lightbulb-on-outline"
              prominent
            >
              <v-alert-title class="text-h6">💡 Productivity Tip</v-alert-title>
              Start your most urgent assignment first, then move on to easier tasks!
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
  <ProjectFormDialog v-model:is-dialog-visible="isProjectDialogVisible" :item-data="itemData" />
  <AssignmentFormDialog
    v-model:is-dialog-visible="isAssignmentDialogVisible"
    :item-data="itemData"
  />
</template>

<style scoped>
.dashboard-container {
  background: linear-gradient(90deg, #0b6623 0%, #1aae6f 100%);

  min-height: 100vh;
  padding: 24px;
}

/* Welcome Banner */
.welcome-banner {
  background: #004d25; /* Deep CSU Green */
  color: white;
  padding: 32px;
  border-radius: 16px;
}

.welcome-banner .text-primary {
  color: #ffd700 !important;
}
.welcome-banner .text-muted {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Cards */
.stats-card,
.content-card,
.quick-actions-card {
  border: 1px solid #dcdcdc;
  border-radius: 12px !important;
  background-color: #f5fbf7 !important;
  box-shadow: 0 2px 8px rgba(0, 64, 32, 0.06) !important;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

/* Deadline Item */
.deadline-item {
  padding: 8px;
  border-radius: 8px;
  background: rgba(0, 100, 0, 0.05);
}

/* Typography Colors */
.text-muted {
  color: #444;
}
.text-primary {
  color: #006400 !important;
}
.text-success {
  color: #0b8c42 !important;
}

/* Button Colors */
.v-btn[color='primary'] {
  background-color: #006400 !important;
  color: white !important;
  border-radius: 8px !important;
}
.v-btn[color='deep-orange'],
.v-btn[color='orange'] {
  background-color: #ffd700 !important;
  color: #1a1a1a !important;
  border-radius: 8px !important;
}
.v-btn[color='info'] {
  background-color: #e8f0ea !important;
  color: #006400 !important;
  border: 1px solid #006400 !important;
  border-radius: 8px !important;
}
.v-btn[color='success'] {
  background-color: #0b8c42 !important;
  color: white !important;
  border-radius: 8px !important;
}

/* Chip & Avatar Adjustments */
.v-avatar[color='primary'] {
  background-color: #006400 !important;
}
.v-avatar[color='success'] {
  background-color: #0b8c42 !important;
}
.v-avatar[color='orange'],
.v-avatar[color='deep-orange'] {
  background-color: #ffd700 !important;
  color: #1a1a1a !important;
}

/* Alert Info */
.v-alert[type='info'] {
  background-color: #e8f0ea !important;
  border-left: 5px solid #006400 !important;
  color: #1a1a1a !important;
}
</style>
