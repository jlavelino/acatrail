<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'

import { ref } from 'vue'

const isDrawerVisible = ref(true)
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #content>
      <v-container></v-container>
    </template>
  </AppLayout>
</template>
