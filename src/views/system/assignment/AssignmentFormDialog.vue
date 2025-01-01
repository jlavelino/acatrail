<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { requiredValidator, imageValidator } from '@/utils/validators'
import { formActionDefault } from '@/utils/supabase.js'
import { useAuthUserStore } from '@/stores/authUser'
import { useDisplay } from 'vuetify'
import { ref, watch } from 'vue'
import { useAssignmentsStore } from '@/stores/assignments'
import { fileExtract } from '@/utils/helpers'

const props = defineProps(['isDialogVisible', 'itemData'])
const emit = defineEmits(['update:isDialogVisible'])

const { mdAndDown } = useDisplay()
const assignmentsStore = useAssignmentsStore()
const authStore = useAuthUserStore()

const formDataDefault = {
  description: '',
  additional_notes: '',
  due_date: '',
  due_time: '',
  image: null,
  user_id: authStore.userData?.id,
}
const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })
const refVForm = ref()
const isUpdate = ref(false)
const imgPreview = ref('/images/img-product.png') // Default placeholder image

// Watch for itemData changes to either populate the form or reset it
watch(
  () => props.itemData,
  () => {
    isUpdate.value = !!props.itemData
    formData.value = props.itemData ? { ...props.itemData } : { ...formDataDefault }
    imgPreview.value = formData.value.image_url ?? '/images/img-product.png'
  },
)

// Preview image when selected
const onPreview = async (event) => {
  const { fileObject, fileUrl } = await fileExtract(event)
  formData.value.image = fileObject
  imgPreview.value = fileUrl // Update preview with the new image
}

// Reset image preview when clearing file input
const onPreviewReset = () => {
  formData.value.image = null
  imgPreview.value = '/images/img-product.png' // Reset to default placeholder image
}

// Handle form submission
const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }
  try {
    const result = isUpdate.value
      ? await assignmentsStore.updateAssignments(formData.value)
      : await assignmentsStore.addAssignments(formData.value)
    formAction.value.formSuccessMessage = isUpdate.value
      ? 'Successfully updated assignment.'
      : 'Successfully added assignment.'
    await assignmentsStore.getAssignments()
    // Reset form after success and close dialog
    setTimeout(() => {
      onFormReset()
    }, 2500)
  } catch (error) {
    formAction.value.formErrorMessage = error.message || 'An error occurred.'
  } finally {
    formAction.value.formProcess = false
  }
}

// Validate and submit the form
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// Reset the form, including the image
const onFormReset = () => {
  formAction.value = { ...formActionDefault }
  formData.value = { ...formDataDefault }
  imgPreview.value = '/images/img-product.png' // Reset the image preview
  emit('update:isDialogVisible', false) // Close the dialog
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
              <v-text-field
                v-model="formData.due_date"
                label="Due Date"
                :rules="[requiredValidator]"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.due_time"
                label="Due Time"
                :rules="[requiredValidator]"
                type="time"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-img
                width="55%"
                class="mx-auto rounded-circle"
                :src="imgPreview"
                alt="Assignment Picture Preview"
                cover
              ></v-img>
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
                @change="onPreview"
                @click:clear="onPreviewReset"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text variant="plain" prepend-icon="mdi-close" @click="onFormReset">Close</v-btn>
          <v-btn prepend-icon="mdi-plus-box" color="red-darken-4" type="submit" variant="elevated">
            {{ isUpdate ? 'Update Assignment' : 'Add Assignment' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
