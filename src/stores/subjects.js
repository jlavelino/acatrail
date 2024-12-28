import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, tableSearch } from '@/utils/supabase'

export const useSubjectsStore = defineStore('subjects', () => {
  // States
  const subjectsFromApi = ref([])
  const subjects = ref([])

  // Actions

  // Retrieve from API and insert more to subjects table in Supabase
  async function getSubjectsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')
    subjects.value = response.data

    const transformedData = subjectsFromApi.value.map((subject) => {
      return {
        name: subject.name,
        units: subject.units,
        description: subject.data?.description ?? '',
      }
    })

    const { data } = await supabase.from('subjects').insert(transformedData).select()

    //Trigger get items actions
    if (data) await getSubjects({ search: '' })
  }

  // Retrieve from Supabase
  async function getSubjects(tableFilters) {
    const search = tableSearch(tableFilters.search) // Use tableFilters.search
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .order('name', { ascending: true })
      .ilike('name', '%' + search + '%')
    subjects.value = data
  }
  // Add a new subject
  async function addSubject(formData) {
    return await supabase.from('subjects').insert([formData]).select()
  }

  // Delete a subject by ID
  async function deleteSubject(id) {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) {
      console.error('Error deleting subject:', error.message)
      return { error }
    }

    // Update the local subjects array after deletion
    subjects.value = subjects.value.filter((subject) => subject.id !== id)
    return { success: true }
  }

  return {
    subjects,
    getSubjectsFromApi,
    getSubjects,
    subjectsFromApi,
    addSubject,
    deleteSubject, // Expose deleteSubject
  }
})
