<script setup lang="ts">
import { ref } from 'vue'
import JoinGroupRequestSend from './widgets/JoinGroupRequestSend.vue'
import JoinGroupRequestReceive from './widgets/JoinGroupRequestReceive.vue'

const valueTab = ref(0)
</script>

<template>
  <VaTabs v-model="valueTab">
    <template #tabs>
      <VaTab v-for="tab in ['Received', 'Sent']" :key="tab">
        {{ tab }}
      </VaTab>
    </template>
  </VaTabs>
  <VaCard>
    <JoinGroupRequestSend v-if="valueTab == 1" />
    <JoinGroupRequestReceive v-if="valueTab == 0" />
  </VaCard>
</template>
