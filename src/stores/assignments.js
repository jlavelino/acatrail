import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from './authUser'

export const useAssignmentsStore = defineStore('assignments', () => {
  // States
  const assignments = ref([])
  const assignmentsFromApi = ref([])
  const authStore = useAuthUserStore()

  // Reset States
  function $reset() {
    assignments.value = []
    assignmentsFromApi.value = []
  }

  // Retrieve assignments from API and insert into Supabase
  async function getAssignmentsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')
    assignmentsFromApi.value = response.data

    const transformedData = assignmentsFromApi.value.map((assignment) => {
      return {
        description: assignment.data?.description || '',
        additional_notes: assignment.data?.additional_notes || '',
        user_id: authStore.userData?.id || null, // Use logged-in user's ID
        subjects_id: assignment.data?.userData?.id || null,
      }
    })

    // Insert data into Supabase if transformedData is not empty
    if (transformedData.length > 0) {
      const { data } = await supabase.from('assignments').insert(transformedData).select()
      if (data) {
        await getAssignments() // Refresh assignments list
      }
    }
  }

  // Retrieve assignments from Supabase
  async function getAssignments() {
    const { data } = await supabase.from('assignments').select('*')
    assignments.value = data || []
  }

  return {
    assignments,
    assignmentsFromApi,
    getAssignmentsFromApi,
    getAssignments,
    $reset,
  }
})
