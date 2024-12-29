import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAssignmentsStore = defineStore('assignments', () => {
  // States
  const assignments = ref([])

  // Actions
  async function getAssignmentsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')

    assignments.value = response.data
  }

  return { getAssignmentsFromApi, assignments }
})
