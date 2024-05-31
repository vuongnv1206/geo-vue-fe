<script setup lang="ts">
import { ref } from 'vue'
import QuestionInPaperCard from './widgets/QuestionInPaperCard.vue'
import AssignPaperModal from './widgets/AssignPaperModal.vue'

const showSidebar = ref(false)
const valueCollapses = ref([])
const collapses = ref([
  { title: 'First collapse', content: '12A9' },
  { title: 'Second collapse', content: 'SE1644222222' },
  { title: 'Third collapse', content: 'asdasd asda123' },
])

const valueTap = ref(0)

const showModalDetail = ref(false)
const showAssignPaperModal = ref(false)

const Clicked = () => {
  alert('ookokoko')
}
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
          <span> De thi 1</span>
          <div>
            <VaButton preset="secondary" border-color="primary" size="small"> Copy link </VaButton>
          </div>
        </VaCardTitle>
        <VaCardContent>
          <VaList class="va-text-secondary text-xs mb-2">
            <VaListItem>
              <VaIcon name="event" class="mr-1 material-symbols-outlined" /> Created at: 28/04/2024 15:18
            </VaListItem>
            <VaListItem>
              <VaIcon name="person" class="mr-1 material-symbols-outlined" /> Creator: Nguyen Thong Duc (K16_HL)
            </VaListItem>
            <VaListItem> <VaIcon name="task" class="mr-1 material-symbols-outlined" /> Submitted: 0 </VaListItem>
          </VaList>

          <VaCard outlined class="mb-2">
            <VaCardTitle>Menu</VaCardTitle>
            <VaCardContent>
              <VaMenuList class="w-full">
                <VaMenuItem> <VaIcon name="settings" class="material-symbols-outlined" /> Setting </VaMenuItem>
                <VaMenuItem><VaIcon name="monitoring" class="material-symbols-outlined" /> Statistics </VaMenuItem>
                <VaMenuItem>
                  <VaIcon name="settings" class="material-symbols-outlined" /> Advanced monitoring
                </VaMenuItem>
                <VaMenuItem class="va-text-danger">
                  <VaIcon name="delete" class="material-symbols-outlined" />
                  Delete
                </VaMenuItem>
              </VaMenuList>
            </VaCardContent>
          </VaCard>

          <VaCard>
            <VaCardTitle class="flex justify-between">
              <span> Assigned to</span>
              <div>
                <VaButton preset="secondary" size="small" @click="showAssignPaperModal = !showAssignPaperModal">
                  <VaIcon name="edit_square" size="small" class="material-symbols-outlined" />
                  edit
                </VaButton>
              </div>
            </VaCardTitle>
            <VaModal v-model="showAssignPaperModal">
              <AssignPaperModal />
            </VaModal>
            <VaCardContent class="p-0">
              <!-- <VaButton preset="secondary" border-color="none" size="small" text-color="secondary" class="w-full">
                Everyone
              </VaButton> -->
              <VaInput placeholder="Search by name" class="mb-1" />
              <VaCard outlined class="container-groupClass">
                <VaCardContent class="p-1">
                  <VaAccordion v-model="valueCollapses" class="max-w-sm text-xs" multiple>
                    <VaCollapse v-for="(collapse, index) in collapses" :key="index" :header="collapse.title">
                      <template #content>
                        <div class="grid md:grid-cols-3 sm:grid-cols-2 gap-2">
                          <VaButton
                            preset="secondary"
                            size="small"
                            border-color="secondary"
                            text-color="secondary"
                            class="class-button"
                          >
                            {{ collapse.content.slice(0, 10) }}
                          </VaButton>
                          <VaButton
                            preset="secondary"
                            size="small"
                            border-color="secondary"
                            text-color="secondary"
                            class="class-button"
                          >
                            {{ collapse.content.slice(0, 10) }}
                          </VaButton>
                          <VaButton
                            preset="secondary"
                            size="small"
                            border-color="secondary"
                            text-color="secondary"
                            class="class-button"
                          >
                            {{ collapse.content.slice(0, 10) }}
                          </VaButton>
                          <VaButton
                            preset="secondary"
                            size="small"
                            border-color="secondary"
                            text-color="secondary"
                            class="class-button"
                          >
                            {{ collapse.content.slice(0, 10) }}
                          </VaButton>
                        </div>
                      </template>
                    </VaCollapse>
                  </VaAccordion>
                </VaCardContent>
              </VaCard>
            </VaCardContent>
          </VaCard>

          <VaCard>
            <VaCardTitle class="flex justify-between">
              <span> Content</span>
              <div>
                <VaButton preset="secondary" size="small">
                  <VaIcon name="edit_square" size="small" class="material-symbols-outlined" />
                  edit
                </VaButton>
              </div>
            </VaCardTitle>
            <VaCardContent>
              <VaButton
                preset="secondary"
                size="small"
                text-color="secondary"
                class="w-full"
                @click="showModalDetail = true"
              >
                See detail
              </VaButton>
              <VaModal v-model="showModalDetail" close-button hide-default-actions max-height="80vh">
                <VaCard class="p-0">
                  <p>Name paper</p>
                  <VaDivider />
                  <VaCardContent class="p-0">
                    <QuestionInPaperCard />
                    <QuestionInPaperCard />
                    <QuestionInPaperCard />
                  </VaCardContent>
                </VaCard>
              </VaModal>
            </VaCardContent>
          </VaCard>
        </VaCardContent>
      </VaCard>
    </template>

    <template #content>
      <VaCardTitle>Student submit (0/0)</VaCardTitle>
      <VaCard class="mt-2 ml-2" style="height: 60vh">
        <VaCardContent class="p-0">
          <VaCardTitle>
            <VaButton size="small">Select class group: Khoi 12 (2) </VaButton>
          </VaCardTitle>
          <VaDivider class="mb-0" />
          <VaTabs v-model="valueTap">
            <template #tabs>
              <VaTab v-for="tab in ['One', 'Two', 'Three']" :key="tab" class="pr-2 pl-2" @click="Clicked">
                {{ tab }}
              </VaTab>
            </template>
            <VaCard outlined>
              <VaCardContent>
                <p>currentTab.content</p>
              </VaCardContent>
            </VaCard>
          </VaTabs>
        </VaCardContent>
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
