<script setup>
import { onMounted } from 'vue'
import { useSubjectsStore } from '@/stores/subjects'

const subjectsStore = useSubjectsStore()

onMounted(async () => {
  if (subjectsStore.subjects.length == 0) await subjectsStore.getSubjectsFromApi()
})
</script>
<template>
  <v-col cols="12" sm="12" class="px-8">
    <v-text-field
      variant="outlined"
      label="Label"
      density="compact"
      append-inner-icon=" mdi-magnify"
      clearable
    >
    </v-text-field>
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
</template>
<style scoped></style>
