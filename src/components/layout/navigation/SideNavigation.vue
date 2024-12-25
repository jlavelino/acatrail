<script setup>
import { mainNav, menuItemsNav1 } from './SideNavigation'
import { useDisplay } from 'vuetify'
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['isDrawerVisible'])
const { mobile } = useDisplay()

const noAccessPages = ref([])
const editableMenuItemsNav1 = ref([...menuItemsNav1])
const isDrawerVisible = ref(props.isDrawerVisible)

watch(
  () => props.isDrawerVisible,
  () => {
    isDrawerVisible.value = props.isDrawerVisible
  },
)

const onFilterPages = async () => {
  // Filter logic if needed
}

onMounted(() => {
  onFilterPages()
})
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
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/system/dashboard"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list-group :key="i" v-for="([title, icon], i) in mainNav">
        <template #activator="{ props }">
          <v-list-item v-bind="props" :prepend-icon="icon" :title="title"></v-list-item>
        </template>

        <template v-if="title === mainNav[0][0]">
          <v-list-item
            v-for="([title, icon, subtitle, to], i) in editableMenuItemsNav1"
            :key="i"
            :prepend-icon="icon"
            :title="title"
            :subtitle="subtitle ?? undefined"
            :to="to ?? undefined"
          ></v-list-item>
        </template>
      </v-list-group>

      <v-divider></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>
