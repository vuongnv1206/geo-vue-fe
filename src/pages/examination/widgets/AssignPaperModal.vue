<script lang="ts" setup>
import { ref, PropType, watch, onMounted } from 'vue'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { GroupClass } from '@/pages/classrooms/type'

const props = defineProps({
  currentAssigned: {
    type: Object as PropType<string>,
    default: null,
  },
})

const groupClassStores = useGroupClassStore()

const valueOption = ref('')
const emit = defineEmits(['close', 'save'])

const groupClasses = ref<GroupClass[] | null>(null)

const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClass()
    groupClasses.value = res
  } catch (error) {
    console.error(error)
  }
}

const getClassByGroupClass = (groupId: string) => {
  console.log(groupId)
}

watch(
  () => props.currentAssigned,
  () => {
    if (props.currentAssigned) {
      valueOption.value = props.currentAssigned
    }
  },
  { immediate: true },
)

const onSave = () => {
  emit('save', valueOption.value)
}

onMounted(() => {
  getGroupClasses()
})
</script>

<template>
  <VaCard class="p-0">
    <b class="pr-3 text-xs"> Who is allowed to take the exam </b>
    <VaRadio v-model="valueOption" :options="['Everyone', 'By Class', 'By Student']" class="assign-radio mb-2" />
    <div
      v-if="valueOption == 'By Class' && groupClasses !== null"
      class="grid grid-cols-1 md:grid-cols-3 gap-2 items-start"
    >
      <VaCard outlined class="border-style col-span-1">
        <div class="p-2">
          <VaInput placeholder="Search" />
        </div>
        <VaDivider class="m-0" />
        <VaCardContent class="p-1">
          <VaScrollContainer vertical class="max-h-[60vh]">
            <VaMenuList
              :options="groupClasses"
              :text-by="(groupClass: GroupClass) => groupClass.name"
              class="w-full"
              :value-by="(groupClass: GroupClass) => groupClass.id"
              @selected="getClassByGroupClass"
            />
          </VaScrollContainer>
        </VaCardContent>
      </VaCard>

      <VaCard outlined class="border-style col-span-2">
        <div class="p-2 flex justify-between">
          <VaButton preset="secondary"> <VaIcon name="menu_open" /></VaButton>
          <div>
            <VaInput placeholder="Search" class="p-0" />
          </div>
        </div>
        <VaDivider class="m-0" />
        <VaCardContent>
          <!-- <VaCheckbox class="mb-6" :label="label" /> -->
        </VaCardContent>
      </VaCard>
    </div>
    <div class="d-flex">
      <VaButton preset="primary" size="small" class="m-1 mt-2">Cancel</VaButton>
      <VaButton size="small" class="m-1 mt-2" @click="onSave">Save</VaButton>
    </div>
  </VaCard>
</template>

<style scoped>
.assign-radio {
  font-size: 0.7rem;
  --va-radio-icon-width: 1rem;
  --va-radio-icon-height: 1rem;
}

.border-style {
  --va-card-outlined-border: 1px solid var(--va-background-element);
}
</style>
