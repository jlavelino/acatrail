import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from './authUser'
import { getSlugText } from '@/utils/helpers'

export const useProjectsStore = defineStore('projects', () => {
  // States
  const projects = ref([])
  const projectsFromApi = ref([])
  const authStore = useAuthUserStore()

  // Reset States
  function $reset() {
    projects.value = []
    projectsFromApi.value = []
  }

  // Retrieve from API and insert into Supabase
  async function getProjectsFromApi() {
    try {
      const response = await axios.get('https://api.restful-api.dev/objects')
      projects.value = response.data

      const transformedData = response.data.map((project) => {
        return {
          description: project?.description ?? '',
          additional_notes: project?.additional_notes ?? '',
          user_id: authStore.userData?.id, // Use logged-in user's ID
          subjects_id: project?.userData?.id ?? null,
        }
      })

      const { data, error } = await supabase.from('projects').insert(transformedData).select()
      if (error) throw error
    } catch (error) {
      console.error('Error fetching or inserting projects:', error.message)
    }
  }

  // Retrieve projects from Supabase
  async function getProjects() {
    try {
      const { data, error } = await supabase.from('projects').select('*')
      if (error) throw error
      projects.value = data
    } catch (error) {
      console.error('Error fetching projects:', error.message)
    }
  }

  // Add projects with image upload
  async function addProjects(formData) {
    const { image, ...data } = formData
    if (image) {
      try {
        const imageUrl = await updateProjectImage(image, formData.description)
        data.image_url = imageUrl
      } catch (error) {
        console.error('Error uploading image:', error.message)
        throw new Error('Failed to upload image. Please try again.')
      }
    }

    try {
      const { data: insertedData, error } = await supabase.from('projects').insert([data]).select()
      if (error) throw error
      return insertedData
    } catch (error) {
      console.error('Error adding project:', error.message)
      throw error
    }
  }

  // Update Product Image
  async function updateProjectImage(file, filename) {
    const filePath = `projects/${getSlugText(filename)}.png`
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

  // update project
  async function updateProjects(formData) {
    const { image } = formData
    if (formData.image) {
      formData.image_url = await updateProjectImage(image, formData.name)
      delete formData.image
    }
    return await supabase.from('projects').update(formData).eq('id', formData.id).select()
  }

  // Delete a subject by ID
  async function deleteProjects(id) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) {
        console.error('Error deleting subject:', error.message)
        return { error }
      }
      // Update the local projects array after deletion
      projects.value = projects.value.filter((project) => project.id !== id)
      return { success: true }
    } catch (error) {
      console.error('Error deleting project:', error.message)
      return { error }
    }
  }

  // Finish an projects
  async function finishProject(id) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ status: 'finished' })
        .eq('id', id)
        .select()
      if (error) throw error

      // Update the local projects list
      projects.value = projects.value.filter((project) => project.id !== id)
      return { success: true, data }
    } catch (error) {
      console.error('Error finishing projects:', error.message)
      return { error }
    }
  }
  return {
    finishProject,
    deleteProjects,
    updateProjects,
    addProjects,
    projects,
    projectsFromApi,
    getProjectsFromApi,
    getProjects,
    $reset,
  }
})
