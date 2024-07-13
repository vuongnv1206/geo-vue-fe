<template>
  <section class="mt-16"></section>
  <section v-if="listClasses.length > 0">Classes</section>
  <section v-else class="flex flex-col items-center gap-2">
    <VaIcon name="delete" size="2rem" color="#154ec1" />
    <p class="font-semibold">There is nothing in the bin</p>
    <p class="text-secondary text-sm">Moving anything you don't need to the bin</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const listClasses = ref([])
</script>
