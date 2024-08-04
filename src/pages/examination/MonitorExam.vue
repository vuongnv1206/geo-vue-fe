<script setup lang="ts">
import { ref } from 'vue'
import { PaperDto, AccessType } from './types'
import { format } from '@/services/utils'

const paperDetail = ref<PaperDto | null>(null)

const showSidebar = ref(true)
</script>

<template>
  <VaLayout style="height: 500px">
    <template #top>
      <VaNavbar class="py-2">
        <template #left>
          <VaButton :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar" />
        </template>
        <template #right>
          <VaNavbarItem class="">
            <VaInput placeholder="Search" />
          </VaNavbarItem>
        </template>
      </VaNavbar>
    </template>

    <template #left>
      <VaCard v-if="showSidebar" class="mt-2" style="min-width: 20rem; max-width: 30rem">
        <VaCardTitle class="flex justify-between">
          <span> {{ paperDetail?.examName }}</span>
        </VaCardTitle>
        <VaCardContent>
          <VaList class="va-text-secondary text-xs mb-2">
            <VaListItem>
              <VaIcon name="event" class="mr-1 material-symbols-outlined" /> Created at:
              {{ format.formatDate(new Date(paperDetail?.createdOn || '')) }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="person" class="mr-1 material-symbols-outlined" /> Creator: {{ paperDetail?.creatorName }}
            </VaListItem>
            <VaListItem> <VaIcon name="task" class="mr-1 material-symbols-outlined" /> Submitted: 0 </VaListItem>
            <VaListItem> <VaIcon name="skip_next" class="mr-1 material-symbols-outlined" /> Doing: 0 </VaListItem>
            <VaListItem>
              <VaIcon name="do_not_disturb_on" class="mr-1 material-symbols-outlined" /> Not Started: 0
            </VaListItem>
          </VaList>

          <VaCard outlined class="mb-2">
            <VaCardTitle>Menu</VaCardTitle>
            <VaCardContent>
              <VaMenuList class="w-full">
                <VaMenuItem> <VaIcon name="assignment_add" class="material-symbols-outlined" /> Reassign</VaMenuItem>
                <VaMenuItem> <VaIcon name="monitoring" class="material-symbols-outlined" /> Statistics </VaMenuItem>
                <VaMenuItem class="va-text-danger">
                  <VaIcon name="report" class="material-symbols-outlined" />
                  Supend student
                </VaMenuItem>
              </VaMenuList>
            </VaCardContent>
          </VaCard>
        </VaCardContent>
      </VaCard>
    </template>

    <template #content>
      <VaCardTitle>Monitor exam</VaCardTitle>
      <VaCard class="mt-2 ml-2" style="height: 60vh">
        <VaCardContent
          v-if="paperDetail?.shareType === AccessType.ByClass || paperDetail?.shareType === AccessType.ByStudent"
          class="p-0"
        >
          <VaCardTitle>List of students</VaCardTitle>
          <VaDivider class="mb-0" />
        </VaCardContent>
        <VaCardContent class="p-2 grid md:grid-cols-4 xs:grid-cols-2 mt-3"> </VaCardContent>
      </VaCard>
    </template>
  </VaLayout>
</template>

<style scoped>
.container-groupClass {
  --va-card-outlined-border: 1px solid var(--va-background-element);
}

.class-button {
  --va-button-sm-font-size: 0.6rem;
}
</style>
