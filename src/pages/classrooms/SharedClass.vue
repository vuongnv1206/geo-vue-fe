<script setup lang="ts">
import { ref, watch } from 'vue'
import { GroupClass } from '@/pages/classrooms/types'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'

const store = useGroupClassStore()
const listGroupClass = ref<GroupClass[]>([])
const loading = ref(true)

const props = defineProps({
  dataFilter: {
    type: Object as () => Record<string, any>,
    default: () => ({
      keyword: '',
      pageNumber: 0,
      pageSize: 100,
      orderBy: ['id'],
    }),
  },
})

const getShareGroupClasses = async () => {
  loading.value = true
  const filter = ref(props.dataFilter)
  console.log(filter.value)
  await store
    .sharedGroupClass(filter.value)
    .then((res) => {
      listGroupClass.value = res.data
    })
    .finally(() => {
      loading.value = false
    })
}

watch(
  () => props.dataFilter,
  async () => {
    await getShareGroupClasses()
  },
  { immediate: true },
)
</script>

<template>
  <VaCard v-if="listGroupClass.length > 0" class="mt-5 p-2">
    <VaScrollContainer vertical>
      <VaAccordion class="max-W-sm" multiple>
        <VaCollapse
          v-for="groupClass in listGroupClass"
          :key="groupClass.id"
          :header="groupClass.name"
          solid
          class="py-1 font-bold"
        >
          <template #header="{ value, attrs, iconAttrs, text }">
            <VaCard v-bind="attrs" class="w-full flex border-2 p-2 items-center">
              <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" />
              <VaCard class="flex justify-between items-center w-full">
                <VaCard> {{ text }} </VaCard>
              </VaCard>
            </VaCard>
          </template>
          <VaCard class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <VaCard v-for="classItem in groupClass.classes" :key="classItem.id">
              <VaCard
                gradient
                :to="{ name: 'class-details', params: { id: classItem.id } }"
                class="border border-gray-200"
              >
                <VaCardContent class="text-gray-600 flex gap-3"
                  >Name class: {{ classItem.name }}
                  <VaIcon name="co_present" />
                </VaCardContent>
                <VaCardContent class="text-xs text-gray-600">School year: {{ classItem.schoolYear }}</VaCardContent>
              </VaCard>
            </VaCard>
          </VaCard>
        </VaCollapse>
      </VaAccordion>
    </VaScrollContainer>
  </VaCard>
</template>
