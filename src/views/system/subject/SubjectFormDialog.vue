<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { requiredValidator } from '@/utils/validators'
import { formActionDefault } from '@/utils/supabase.js'
import { useSubjectsStore } from '@/stores/subjects' // Use the subjects store
import { useDisplay } from 'vuetify'
import { ref } from 'vue'

const props = defineProps(['isDialogVisible', 'itemData', 'tableFilters'])

const emit = defineEmits(['update:isDialogVisible'])

// Utilize pre-defined Vue functions
const { mdAndDown } = useDisplay()

// Use Pinia Store
const subjectsStore = useSubjectsStore() // Corrected store reference

// Load Variables
const formDataDefault = {
  name: '',
  units: '0',
  description: '',
}
const formData = ref({
  ...formDataDefault,
})
const formAction = ref({
  ...formActionDefault,
})
const refVForm = ref()
const isUpdate = ref(false)

const onSubmit = async () => {
  // Reset Form Action utils
  formAction.value = { ...formActionDefault, formProcess: true }

  try {
    // Check if isUpdate is true, then do update; if false, add a new subject
    const { data, error } = await subjectsStore.addSubject(formData.value)

    if (error) {
      // Add Error Message and Status Code
      formAction.value.formErrorMessage = error.message
      formAction.value.formStatus = error.status

      // Turn off processing
      formAction.value.formProcess = false
    } else if (data) {
      // Add Success Message
      formAction.value.formSuccessMessage = isUpdate.value
        ? 'Successfully Updated Product Information.'
        : 'Successfully Added Product.'

      // Refresh subjects with filters
      await subjectsStore.getSubjects(props.tableFilters)

      // Reset Form and Close Dialog
      setTimeout(() => {
        onFormReset()
      }, 2500)
    }
  } catch (err) {
    formAction.value.formErrorMessage = err.message || 'An error occurred.'
  } finally {
    formAction.value.formProcess = false
  }
}

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// Form Reset
const onFormReset = () => {
  formAction.value = { ...formActionDefault }
  formData.value = { ...formDataDefault }
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <v-dialog
    :max-width="mdAndDown ? undefined : '800'"
    :model-value="props.isDialogVisible"
    persistent
  >
    <v-card prepend-icon="mdi-information-box" title="Subject Information">
      <AlertNotification
        :form-success-message="formAction.formSuccessMessage"
        :form-error-message="formAction.formErrorMessage"
      ></AlertNotification>

      <v-form ref="refVForm" @submit.prevent="onFormSubmit">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Name"
                :rules="[requiredValidator]"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.units"
                label="Units"
                min="0"
                type="number"
                :rules="[requiredValidator]"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                rows="2"
                label="Description"
                :rules="[requiredValidator]"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>

          <v-btn text variant="plain" prepend-icon="mdi-close" @click="onFormReset"> Close </v-btn>

          <v-btn
            prepend-icon="mdi-pencil"
            color="red-darken-4"
            type="submit"
            variant="elevated"
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
          >
            {{ isUpdate ? 'Update Product' : 'Add Product' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
