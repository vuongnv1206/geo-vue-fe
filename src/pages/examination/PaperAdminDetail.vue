<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AssignPaperModal from './widgets/AssignPaperModal.vue'
import QuestionView from '../question/widgets/QuestionView.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaperStore } from '@/stores/modules/paper.module'
import { PaperDto } from './types'
import { useToast, useModal } from 'vuestic-ui'

const route = useRoute()
const router = useRouter()
const paperStore = usePaperStore()
const { init: notify } = useToast()
const { confirm } = useModal()

const paperDetail = ref<PaperDto | null>(null)

const getPaperDetail = () => {
  const paperId = route.params.id
  paperStore
    .paperDetail(paperId.toString())
    .then((res) => {
      paperDetail.value = res
    })
    .catch((error) => {
      notify({
        message: `Not Found ${error}`,
        color: 'danger',
      })
    })
}

const formatDate = (isoString: string | undefined, localization: string) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return new Intl.DateTimeFormat(localization, { dateStyle: 'long' }).format(date)
}

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
const assignedOptionValue = ref('Everyone')

const Clicked = () => {
  alert('ookokoko')
}

const deletePaper = async () => {
  const result = await confirm({
    message: `Are you sure want to delete "${paperDetail.value?.examName}"?`,
    title: 'Delete Paper',
    okText: 'Confirm',
    size: 'small',
  })

  if (result && paperDetail.value !== null) {
    paperStore
      .deletePaper(paperDetail.value.id)
      .then(() => {
        notify({
          message: `Delete ${paperDetail.value?.examName} successfully`,
          color: 'success',
        })
        router.push({ name: 'paper-folder' })
      })
      .catch((error) => {
        notify({
          message: `Failed to delete \n ${error}`,
          color: 'danger',
        })
      })
  }
}

const paperConfigAction = () => {
  router.push({ name: 'paper-config', params: { id: route.params.id } })
}

const handleSaveAssigned = (selectedOption: string) => {
  console.log(selectedOption)
  assignedOptionValue.value = selectedOption
  showAssignPaperModal.value = false
}

onMounted(() => {
  getPaperDetail()
})
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
          <div>
            <VaButton preset="secondary" border-color="primary" size="small"> Copy link </VaButton>
          </div>
        </VaCardTitle>
        <VaCardContent>
          <VaList class="va-text-secondary text-xs mb-2">
            <VaListItem>
              <VaIcon name="event" class="mr-1 material-symbols-outlined" /> Created at:
              {{ formatDate(paperDetail?.createdOn, 'Vi') }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="person" class="mr-1 material-symbols-outlined" /> Creator: {{ paperDetail?.creatorName }}
            </VaListItem>
            <VaListItem> <VaIcon name="task" class="mr-1 material-symbols-outlined" /> Submitted: 0 </VaListItem>
          </VaList>

          <VaCard outlined class="mb-2">
            <VaCardTitle>Menu</VaCardTitle>
            <VaCardContent>
              <VaMenuList class="w-full">
                <VaMenuItem @click="paperConfigAction">
                  <VaIcon name="settings" class="material-symbols-outlined" /> Setting
                </VaMenuItem>
                <VaMenuItem><VaIcon name="monitoring" class="material-symbols-outlined" /> Statistics </VaMenuItem>
                <VaMenuItem>
                  <VaIcon name="settings" class="material-symbols-outlined" /> Advanced monitoring
                </VaMenuItem>
                <VaMenuItem class="va-text-danger" @click="deletePaper">
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
            <VaModal v-slot="{ cancel, ok }" v-model="showAssignPaperModal" hide-default-actions>
              <AssignPaperModal
                :current-assigned="assignedOptionValue"
                @close="cancel"
                @save="
                  (data: string) => {
                    handleSaveAssigned(data)
                    ok()
                  }
                "
              />
            </VaModal>
            <VaCardContent class="p-0">
              <VaButton
                v-if="assignedOptionValue == 'Everyone'"
                preset="secondary"
                border-color="none"
                size="small"
                text-color="secondary"
                class="w-full"
                @click="showAssignPaperModal = !showAssignPaperModal"
              >
                Everyone
              </VaButton>
              <div v-if="assignedOptionValue == 'By Class'">
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
              </div>
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
                  <p>{{ paperDetail?.examName }}</p>
                  <VaDivider />
                  <VaCardContent class="p-0">
                    <template v-for="question in paperDetail?.questions" :key="question.id">
                      <QuestionView :question="question" :index="null" />
                    </template>
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
        <VaCardContent v-if="assignedOptionValue === 'By Class'" class="p-0">
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
        <VaCardContent v-if="assignedOptionValue === 'Everyone'" class="p-2 grid md:grid-cols-6 xs:grid-cols-2">
          <VaCard outlined class="mr-2" href="./text-review">
            <div class="p-2 flex">
              <VaAvatar size="small" class="mr-2"> Q </VaAvatar>
              <div>
                <p><b>Duc nguyen</b></p>
                <span style="font-weight: none">Point: 0</span>
              </div>
            </div>
            <VaDivider class="m-0" />
            <VaCardContent class="p-2">
              <div class="flex justify-between">
                <p class="va-text-secondary text-xs">Duration:</p>
                <p class="va-text-secondary text-xs">9 second(s)</p>
              </div>
              <div class="flex justify-between">
                <p class="va-text-secondary text-xs">Due Date:</p>
                <p class="va-text-secondary text-xs">29 minute(s) ago</p>
              </div>
            </VaCardContent>
          </VaCard>
          <VaCard outlined class="mr-2" href="./text-review">
            <div class="p-2 flex">
              <VaAvatar size="small" class="mr-2"> Q </VaAvatar>
              <div>
                <p><b>Duc nguyen</b></p>
                <span style="font-weight: none">Point: 0</span>
              </div>
            </div>
            <VaDivider class="m-0" />
            <VaCardContent class="p-2">
              <div class="flex justify-between">
                <p class="va-text-secondary text-xs">Duration:</p>
                <p class="va-text-secondary text-xs">9 second(s)</p>
              </div>
              <div class="flex justify-between">
                <p class="va-text-secondary text-xs">Due Date:</p>
                <p class="va-text-secondary text-xs">29 minute(s) ago</p>
              </div>
            </VaCardContent>
          </VaCard>
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
