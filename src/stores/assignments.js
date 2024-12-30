import { supabase } from '@/utils/supabase'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthUserStore } from './authUser'

export const useAssignmentsStore = defineStore('assignments', () => {
  const authStore = useAuthUserStore()
  // States
  const assignmentsFromApi = ref([])
  const assignments = ref([])

  // Actions
  // Retrieve from api
  async function getAssignmentsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')

    assignments.value = response.data

    const transformedData = assignmentsFromApi.value.map((assignment) => {
      return {
        description: assignment.data?.description ?? '',
        additional_notes: assignment.data?.additional_notes ?? '',
        user_id: authStore.userData.id,
        subjects_id: assignment.data?.userData.id ?? '',
      }
    })

    const { data } = await supabase.from('assignments').insert(transformedData).select()
    if (data) await getAssignments()
  }

  // Retrieve from supabase
  async function getAssignments() {
    const { data } = await supabase.from('assignments').select('*')

    assignments.value = data
  }

  return { getAssignmentsFromApi, assignments, assignmentsFromApi, getAssignments }
})
