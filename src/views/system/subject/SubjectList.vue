<script setup>
import SubjectFormDialog from './SubjectFormDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { onMounted, ref } from 'vue'
import { useSubjectsStore } from '@/stores/subjects'
import { formActionDefault } from '@/utils/supabase'

// Use Pinia Store
const subjectsStore = useSubjectsStore()

// Load variables
const isDialogVisible = ref(false)
const deleteId = ref(null)
const formAction = ref({
  ...formActionDefault,
})
const isConfirmDeleteDialog = ref(false)

// Add Subject
const onAdd = () => {
  isDialogVisible.value = true
}

// Trigger Delete Dialog
const onDelete = (id) => {
  deleteId.value = id
  isConfirmDeleteDialog.value = true
}

// Confirm Delete
const onConfirmDelete = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  const { error } = await subjectsStore.deleteSubject(deleteId.value)

  formAction.value.formProcess = false

  if (error) {
    formAction.value.formErrorMessage = error.message
    return
  }

  formAction.value.formSuccessMessage = 'Successfully Deleted Subject.'

  // Refresh the subjects list
  await subjectsStore.getSubjects()
}

onMounted(async () => {
  if (subjectsStore.subjects.length === 0) await subjectsStore.getSubjects()
})
</script>

<template>
  <v-col cols="12" sm="9" class="px-8">
    <v-text-field
      variant="outlined"
      label="Label"
      density="compact"
      append-inner-icon="mdi-magnify"
      clearable
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="3" class="pr-8">
    <v-btn variant="tonal" @click="onAdd" block>Add Subjects</v-btn>
  </v-col>

  <v-col
    cols="12"
    sm="4"
    class="pa-7"
    v-for="subjects in subjectsStore.subjects"
    :key="subjects.id"
  >
    <v-card variant="tonal" min-height="200" width="250">
      <v-card-text>
        <!-- Name -->
        <div class="font-weight-bold text-h6 mb-2">{{ subjects.name }}</div>

        <!-- Units -->
        <div class="text-body-2 mb-1">
          Units: <span class="font-weight-medium">{{ subjects.units }}</span>
        </div>

        <!-- Description -->
        <div class="text-body-2">{{ subjects.description }}</div>
      </v-card-text>

      <v-card-actions style="display: flex; justify-content: flex-end">
        <v-btn icon color="red" @click="onDelete(subjects.id)">
          <v-icon size="28">mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>

  <SubjectFormDialog v-model:is-dialog-visible="isDialogVisible"></SubjectFormDialog>

  <ConfirmDialog
    v-model:is-dialog-visible="isConfirmDeleteDialog"
    title="Confirm Delete"
    text="Are you sure you want to delete this subject?"
    @confirm="onConfirmDelete"
  ></ConfirmDialog>
</template>

<style scoped></style>
