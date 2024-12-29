<script setup>
import { ref } from 'vue'

// for the tabs part
const tab = ref('one')
</script>
<template>
  <v-card>
    <v-tabs v-model="tab" class="auth-background tabs-head">
      <v-tab value="one">Your ASSIGNMENT</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-card class="mx-auto" max-width="100%" hover>
            <v-card-item>
              <v-card-title style="font-family: 'Poppins'; color: #00838f">
                <b>To Do Assignment </b>
                <v-icon
                  class="mdi mdi-alert-octagon"
                  style="font-size: 25px"
                  color="red-darken-3"
                ></v-icon>
              </v-card-title>
              <v-card-subtitle>Plan, Prioritize, and Complete your Assignment</v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <v-row>
                <v-col cols="12" class="pa-4">
                  <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>
                  <v-card class="mb-5 custom-border" elevation="0" outlined>
                    <v-card-text class="d-flex justify-space-between align-center">
                      <div>
                        <div><strong>Title:</strong></div>
                        <div><strong>Description:</strong></div>
                        <div><strong>Additional Notes:</strong></div>
                        <div><strong>Due Date:</strong></div>
                      </div>
                      <div>
                        <v-card-actions style="display: flex; justify-content: flex-end">
                          <v-btn icon variant="elevated" density="comfortable" color="black">
                            <v-icon size="20">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn icon variant="elevated" density="comfortable" color="red">
                            <v-icon size="20">mdi-delete</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
