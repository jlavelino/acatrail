<script setup>
import SubjectFormDialog from './SubjectFormDialog.vue'
import { onMounted, ref } from 'vue'
import { useSubjectsStore } from '@/stores/subjects'

// Use pinia store
const subjectsStore = useSubjectsStore()

// Load variables
const isDialogVisible = ref(false)

// Add item
const onAdd = () => {
  isDialogVisible.value = true
}

onMounted(async () => {
  if (subjectsStore.subjects.length == 0) await subjectsStore.getSubjects()
})
</script>
<template>
  <v-col cols="12" sm="9" class="px-8">
    <v-text-field
      variant="outlined"
      label="Label"
      density="compact"
      append-inner-icon=" mdi-magnify"
      clearable
    >
    </v-text-field>
  </v-col>

  <v-col cols="12" sm="3" class="pr-8">
    <v-btn variant="tonal" @click="onAdd" block> Add Subjects</v-btn>
  </v-col>
  <v-col
    cols="12"
    sm="4"
    class="pa-7"
    v-for="subjects in subjectsStore.subjects"
    :key="subjects.id"
  >
    <v-card :title="subjects.name" variant="tonal" min-height="200" width="250">
      <v-card-text>
        <ul class="ms-5">
          <li v-for="(value, key) in subjects.data" :key="key">
            <span class="font-weight-bold">{{ key }}:</span>{{ value }}
          </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-btn>Click me</v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
  <SubjectFormDialog v-model:is-dialog-visible="isDialogVisible"></SubjectFormDialog>
</template>
<style scoped></style>
