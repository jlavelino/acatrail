<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/navigation/SideNavigation.vue'

import { ref } from 'vue'
import { useDisplay } from 'vuetify'
const isDrawerVisible = ref(true)
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>
    <template #content>
      <v-container>
        <v-card>
          <v-row>
            <v-col cols="12" class="pa-5 pt-10">
              <v-card title="Here are the lists of available SUBJECTS:" variant="tonal"></v-card>
            </v-col>

            <v-col cols="12" sm="8" class="px-8">
              <v-text-field
                variant="outlined"
                label="Label"
                density="compact"
                append-inner-icon=" mdi-magnify"
                clearable
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" class="pa-5">
              <v-card
                title="Card title"
                subtitle="Subtitle"
                text="..."
                variant="tonal"
                height="200"
                width="250"
              >
                <v-card-actions>
                  <v-btn>Click me</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>
