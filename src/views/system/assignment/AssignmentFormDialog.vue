<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { requiredValidator, imageValidator } from '@/utils/validators'
import { formActionDefault } from '@/utils/supabase.js'
import { useAuthUserStore } from '@/stores/authUser'
import { useDisplay } from 'vuetify'
import { ref, watch } from 'vue'
import { useAssignmentsStore } from '@/stores/assignments'

const props = defineProps(['isDialogVisible', 'itemData', 'tableFilters'])

const emit = defineEmits(['update:isDialogVisible'])

const { mdAndDown } = useDisplay()

const assignmentsStore = useAssignmentsStore()
const authStore = useAuthUserStore()

const formDataDefault = {
  description: '',
  additional_notes: '',
  due_date: '',
  image: null,
  user_id: authStore.userData?.id, // Fallback for user_id
}
const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })
const refVForm = ref()
const isUpdate = ref(false)
const imgPreview = ref('/images/img-product.png')

// Watch for dialog visibility changes to reset form
watch(
  () => props.isDialogVisible,
  (newValue) => {
    if (!newValue) {
      onFormReset()
    }
  },
)

const onSubmit = async () => {
  // Reset Form Action utils
  formAction.value = { ...formActionDefault, formProcess: true }

  try {
    // Check if isUpdate is true, then do update; if false, add a new subject
    const { data, error } = await assignmentsStore.addAssignments(formData.value)

    if (error) {
      // Add Error Message and Status Code
      formAction.value.formErrorMessage = error.message
      formAction.value.formStatus = error.status

      // Turn off processing
      formAction.value.formProcess = false
    } else if (data) {
      // Add Success Message
      formAction.value.formSuccessMessage = isUpdate.value
        ? 'Successfully Updated Subject Information.'
        : 'Successfully Added Subject.'

      // Refresh subjects with filters
      await assignmentsStore.getAssignments(props.tableFilters)

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
    <v-card prepend-icon="mdi-information-box" title="Assignment Information">
      <AlertNotification
        :form-success-message="formAction.formSuccessMessage"
        :form-error-message="formAction.formErrorMessage"
      ></AlertNotification>

      <v-form ref="refVForm" @submit.prevent="onFormSubmit">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="formData.description"
                label="Description"
                :rules="[requiredValidator]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="formData.additional_notes"
                label="Additional Notes"
                :rules="[requiredValidator]"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.due_date"
                rows="2"
                label="Due Date"
                :rules="[requiredValidator]"
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-img
                width="55%"
                class="mx-auto rounded-circle"
                color="red-darken-4"
                aspect-ratio="1"
                :src="imgPreview"
                alt="Assignment Picture Preview"
                cover
              >
              </v-img>
            </v-col>

            <v-col cols="12" sm="6" md="8">
              <v-file-input
                class="mt-5"
                :rules="[imageValidator]"
                accept="image/png, image/jpeg"
                label="Browse Assignment Picture"
                placeholder="Browse Assignment Picture"
                prepend-icon="mdi-camera"
                show-size
                chips
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text variant="plain" prepend-icon="mdi-close" @click="onFormReset"> Close </v-btn>
          <v-btn prepend-icon="mdi-plus-box" color="red-darken-4" type="submit" variant="elevated">
            {{ isUpdate ? 'Update Assignment' : 'Add Assignment' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
