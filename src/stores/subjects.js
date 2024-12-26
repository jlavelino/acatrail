import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

export const useSubjectsStore = defineStore('subjects', () => {
  //States
  const subjectsFromApi = ref([])
  const subjects = ref([])

  //Getters
  //const sample = computed(() => count.value * 2)

  //Actions
  // Retrieve from api and insert more to subjects table in supabase
  async function getSubjectsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')
    subjects.value = response.data

    const transformedData = subjectsFromApi.value.map((subjects) => {
      return {
        name: subjects.name,
        units: subjects.units,
        description: subjects.data?.description ?? '',
      }
    })

    const { data } = await supabase.from('subjects').insert(transformedData).select()
    if (data) await getSubjects()
  }

  // retrieve from supabase
  async function getSubjects() {
    const { data } = await supabase.from('subjects').select('*')
    subjects.value = data
  }

  async function addSubject(formData) {
    return await supabase.from('subjects').insert([formData]).select()
  }

  return { subjects, getSubjectsFromApi, getSubjects, subjectsFromApi, addSubject }
})
