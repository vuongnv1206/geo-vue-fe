<script setup lang="ts">
import { ref, watch } from 'vue'
import { GroupTeacher } from './types'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { useToast } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  searchFilter: string | null
  selectedItemId: string | null
}>()

const { init: notify } = useToast()
const { t } = useI18n()
const teacherGroupStore = useGroupTeacherStore()

const groupTeachers = ref<GroupTeacher[]>([])

const getGroupTeacher = (filter: string | null = null) => {
  const dataFilter = ref({
    advancedSearch: {
      fields: ['name'],
      keyword: filter,
    },
    orderBy: ['id'],
  })
  teacherGroupStore
    .shareTeacherGroups(dataFilter.value)
    .then((res) => {
      groupTeachers.value = res.data
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('teacherGroups.group_teacher')) + getErrorMessage(error),
        color: 'danger',
      })
    })
}
const emit = defineEmits(['selectedGroup'])

const selectGroup = (group: GroupTeacher) => {
  emit('selectedGroup', group)
}

watch(
  () => props.searchFilter,
  async (newSearch) => {
    await getGroupTeacher(newSearch)
  },
  { immediate: true },
)
</script>

<template>
  <VaListItem
    v-for="group in groupTeachers"
    :key="group.id"
    class="list__item cursor-pointer pt-2 pb-2"
    :class="{ selectItem: props.selectedItemId === group.id }"
    @click="selectGroup(group)"
  >
    <VaListItemSection avatar class="justify-center">
      <VaIcon name="group" />
    </VaListItemSection>

    <VaListItemSection>
      <VaListItemLabel>
        {{ group.name }}
      </VaListItemLabel>
    </VaListItemSection>

    <VaListItemSection icon class="m-0">
      <VaBadge text="shared" color="success" class="mr-1" />
    </VaListItemSection>
  </VaListItem>
</template>

<style lang="scss" scoped>
.list__item:hover {
  background-color: #f1f5f9;
}

.selectItem {
  background-color: #f1f5f9;
}
</style>
