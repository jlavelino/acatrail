import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from './authUser'
import { getSlugText } from '@/utils/helpers'

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

  // Retrieve from API and insert into Supabase
  async function getAssignmentsFromApi() {
    try {
      const response = await axios.get('https://api.restful-api.dev/objects')
      assignments.value = response.data

      const transformedData = response.data.map((assignment) => {
        return {
          description: assignment?.description ?? '',
          additional_notes: assignment?.additional_notes ?? '',
          user_id: authStore.userData?.id, // Use logged-in user's ID
          subjects_id: assignment?.userData?.id ?? null,
        }
      })

      const { data, error } = await supabase.from('assignments').insert(transformedData).select()
      if (error) throw error
    } catch (error) {
      console.error('Error fetching or inserting assignments:', error.message)
    }
  }

  // Retrieve assignments from Supabase
  async function getAssignments() {
    try {
      const { data, error } = await supabase.from('assignments').select('*')
      if (error) throw error
      assignments.value = data
    } catch (error) {
      console.error('Error fetching assignments:', error.message)
    }
  }

  // Add assignments with image upload
  async function addAssignments(formData) {
    const { image, ...data } = formData
    if (image) {
      try {
        const imageUrl = await updateAssignmentImage(image, formData.description)
        data.image_url = imageUrl
      } catch (error) {
        console.error('Error uploading image:', error.message)
        throw new Error('Failed to upload image. Please try again.')
      }
    }

    try {
      const { data: insertedData, error } = await supabase
        .from('assignments')
        .insert([data])
        .select()
      if (error) throw error
      return insertedData
    } catch (error) {
      console.error('Error adding assignment:', error.message)
      throw error
    }
  }

  // Update Product Image
  async function updateAssignmentImage(file, filename) {
    const filePath = `assignments/${getSlugText(filename)}.png`
    try {
      const { data, error } = await supabase.storage.from('acatrail').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (error) throw error

      const { data: imageData, error: urlError } = supabase.storage
        .from('acatrail')
        .getPublicUrl(data.path)
      if (urlError) throw urlError

      return imageData.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error.message)
      throw error
    }
  }

  return {
    addAssignments,
    assignments,
    assignmentsFromApi,
    getAssignmentsFromApi,
    getAssignments,
    $reset,
  }
})
