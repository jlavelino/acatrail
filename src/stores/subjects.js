import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectsStore = defineStore('subjects', () => {
  //States
  const subjects = ref([])

  //Getters
  //const sample = computed(() => count.value * 2)

  //Actions
  async function getSubjectsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')
    subjects.value = response.data
  }

  return { subjects, getSubjectsFromApi }
})
