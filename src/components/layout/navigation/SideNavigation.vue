<script setup>
import { useDisplay } from 'vuetify'
import { ref, watch } from 'vue'

const props = defineProps(['isDrawerVisible'])
const { mobile } = useDisplay()
const isDrawerVisible = ref(props.isDrawerVisible)

// Sync prop changes
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
    :temporary="mobile"
    :permanent="!mobile"
    app
    width="250"
    class="side-nav"
  >
    <v-list density="compact" nav>
      <!-- Dashboard -->
      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/system/dashboard" />
      <v-divider />
      <!-- Your Tasks Dropdown -->
      <v-list-group>
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-notebook-multiple" title="Your Tasks" />
        </template>
        <v-list-item
          v-for="([title, icon, to], i) in [
            ['Assignments', 'mdi-pencil-box-outline', '/assignments'],
            ['Projects', 'mdi-book-multiple', '/projects'],
          ]"
          :key="i"
          :prepend-icon="icon"
          :title="title"
          :to="to"
        />
      </v-list-group>
      <v-divider />
      <v-list-item prepend-icon="mdi-bookshelf" title="List of Subjects" to="/subjects" />
      <v-divider />
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped>
.side-nav {
  background: linear-gradient(180deg, #0b6623 0%, #1aae6f 100%);
  color: #ffffff;

  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

/* List item styles */
.v-list-item {
  color: #e2e2e2 !important;
  font-weight: 500;

  margin: 2px 6px;
  transition: all 0.2s ease-in-out;
}

/* Hover effect */
.v-list-item:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  transform: translateX(2px);
}

/* Active item */
.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.2);
}

/* Icons and titles */
.v-list-item__prepend {
  color: #ffd700 !important; /* Gold icon accent */
}
.v-list-item__title {
  color: #ffffff !important;
  font-size: 15px;
  font-weight: 500;
}

/* Divider subtle */
.v-divider {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

/* Drawer animation */
.v-navigation-drawer {
  transition: all 0.3s ease-in-out !important;
}

/* Mobile drawer shadow */
@media (max-width: 960px) {
  .side-nav {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  }
}
</style>
