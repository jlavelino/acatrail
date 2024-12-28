import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, tableSearch } from '@/utils/supabase'
import { getSlugText } from '@/utils/helpers'

export const useSubjectsStore = defineStore('subjects', () => {
  // States
  const subjectsFromApi = ref([])
  const subjects = ref([])

  // Reset States
  function $reset() {
    subjectsFromApi.value = []
    subjects.value = []
  }

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
    // check if there is image uploaded in form
    if (formData.image) {
      // upload image in supabase and get url
      formData.image_url = await updateSubjectImage(formData.image, formData.name)
      delete formData.image
    }

    // insert form data in subject
    return await supabase.from('subjects').insert([formData]).select()
  }

  // Update Subjects
  async function updateSubject(formData) {
    // check if there is image uploaded in form
    if (formData.image) {
      // upload image in supabase and get url
      formData.image_url = await updateSubjectImage(formData.image, formData.name)
      delete formData.image
    }

    // update for data in subject
    return await supabase.from('subjects').update(formData).eq('id', formData.id).select()
  }

  // Update Product Image
  async function updateSubjectImage(file, filename) {
    // Upload the file with the file name and file extension
    const { data } = await supabase.storage
      .from('acatrail')
      .upload('subjects/' + getSlugText(filename) + '.png', file, {
        cacheControl: '3600',
        upsert: true,
      })

    // If no error set data to userData state with the image_url
    if (data) {
      // Retrieve Image Public Url
      const { data: imageData } = supabase.storage.from('acatrail').getPublicUrl(data.path)
      return imageData.publicUrl
    }
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
    $reset,
    subjects,
    getSubjectsFromApi,
    getSubjects,
    subjectsFromApi,
    addSubject,
    updateSubject,
    deleteSubject,
  }
})
