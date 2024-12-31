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

    // Trigger get items actions
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
    const { image, ...data } = formData

    // Check if there is an image uploaded in the form
    if (image) {
      // Upload the image and get its URL
      const imageUrl = await updateSubjectImage(image, formData.name)
      if (imageUrl) {
        formData.image_url = imageUrl // Set the image URL in form data
      } else {
        console.error('Image upload failed, no URL returned.')
      }

      // Remove image from form data (as it's already uploaded)
      delete formData.image
    }

    // Insert form data into subjects table in Supabase
    const { data: insertedData, error } = await supabase
      .from('subjects')
      .insert([formData])
      .select()

    if (error) {
      console.error('Error inserting subject:', error.message)
      return { error }
    }

    return { data: insertedData }
  }

  // Update Subjects
  async function updateSubject(formData) {
    // Check if there is an image uploaded in the form
    if (formData.image) {
      // Upload the image and get its URL
      const imageUrl = await updateSubjectImage(formData.image, formData.name)
      if (imageUrl) {
        formData.image_url = imageUrl // Set the image URL in form data
      } else {
        console.error('Image upload failed, no URL returned.')
      }

      // Remove image from form data (as it's already uploaded)
      delete formData.image
    }

    // Update the subject in the subjects table in Supabase
    const { data: updatedData, error } = await supabase
      .from('subjects')
      .update(formData)
      .eq('id', formData.id)
      .select()

    if (error) {
      console.error('Error updating subject:', error.message)
      return { error }
    }

    return { data: updatedData }
  }

  // Update Product Image
  async function updateSubjectImage(file, filename) {
    try {
      // Generate a valid file path
      const filePath = 'subjects/' + getSlugText(filename) + '.png'

      // Upload the file with the file name and file extension
      const { data, error } = await supabase.storage.from('acatrail').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

      // Check for upload error
      if (error) {
        console.error('Error uploading image:', error.message)
        return null
      }

      // Log the data for debugging
      console.log('Upload success, data:', data)

      // Retrieve Image Public URL
      const { data: imageData, error: urlError } = await supabase.storage
        .from('acatrail')
        .getPublicUrl(data.path)

      // Check for URL retrieval error
      if (urlError) {
        console.error('Error retrieving image URL:', urlError.message)
        return null
      }

      // Return the public URL
      return imageData.publicUrl
    } catch (err) {
      console.error('Unexpected error in image upload:', err)
      return null
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
