<script setup>
import { mainNav } from './SideNavigation'
import { useDisplay } from 'vuetify'
import { ref, watch } from 'vue'

const props = defineProps(['isDrawerVisible'])

// Utilize pre-defined Vue functions
const { mobile } = useDisplay()

// Load Variables
const isDrawerVisible = ref(props.isDrawerVisible)

// Watch props if they change
watch(
  () => props.isDrawerVisible,
  () => {
    isDrawerVisible.value = props.isDrawerVisible
  },
)
</script>

<template>
  <v-navigation-drawer
    v-model="isDrawerVisible"
    :persistent="mobile"
    :temporary="mobile"
    :permanent="!mobile"
    width="325"
  >
    <v-list density="compact" nav>
      <!-- Dashboard -->
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/system/dashboard"
      ></v-list-item>

      <v-divider></v-divider>

      <!-- Your Tasks Dropdown -->
      <v-list-group>
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-notebook-multiple" title="Your Tasks" />
        </template>
        <v-list-item
          v-for="([title, icon, subtitle, to], i) in [
            ['Assignments', 'mdi-pencil-box-outline', null, '/assignments'],
            ['Projects', 'mdi-book-multiple', null, '/projects'],
          ]"
          :key="i"
          :prepend-icon="icon"
          :title="title"
          :subtitle="subtitle ?? undefined"
          :to="to ?? undefined"
        ></v-list-item>
      </v-list-group>
      <v-divider></v-divider>
      <!-- List of Subjects -->
      <v-list-item
        prepend-icon="mdi-bookshelf"
        title="List of Subjects"
        to="/subjects"
      ></v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>
