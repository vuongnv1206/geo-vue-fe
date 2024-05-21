<script setup lang="ts">
import { PropType } from 'vue'
import { GroupClass } from '../type'

defineProps({
  groupClasses: {
    type: Array as PropType<GroupClass[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

defineEmits<{
  (event: 'edit', groupClass: GroupClass): void
  (event: 'delete', groupClass: GroupClass): void
}>()
</script>

<template>
  <VaInnerLoading
    v-if="groupClasses.length > 0 || loading"
    :loading="loading"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[4rem]"
  >
    <VaCard
      v-for="gc in groupClasses"
      :key="gc.name"
      :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
      outlined
    >
      <VaCardContent class="flex flex-col h-full">
        <div class="flex flex-col items-center gap-4 grow">
          <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
            {{ gc.name }}
          </h4>
        </div>
        <VaDivider class="my-6" />
        <div class="flex justify-between">
          <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="$emit('edit', gc)" />
          <VaButton preset="secondary" icon="mso-delete" color="danger" @click="$emit('delete', gc)" />
        </div>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
  <div v-else class="p-4 flex justify-center items-center text-[var(--va-secondary)]">No group class</div>
</template>
