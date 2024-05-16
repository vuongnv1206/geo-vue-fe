<template>
  <div class="flex mt-2">
    <div class="mr-3 flex-grow">
      <VaInput class="" placeholder="Search name, phone or email">
        <template #appendInner>
          <VaIcon color="secondary" class="material-icons"> search </VaIcon>
        </template>
      </VaInput>
    </div>
    <div class="">
      <VaDropdown>
        <template #anchor>
          <VaButton>
            <span class="material-symbols-outlined"> add </span>
          </VaButton>
        </template>
        <VaDropdownContent> New teacher </VaDropdownContent>
        <VaDropdownContent> New teacher group </VaDropdownContent>
      </VaDropdown>
    </div>
  </div>
  <div class="my-8">
    <VaDivider />
  </div>
  <VaList>
    <VaListItem v-for="group in groupTeachers" :key="group.id" class="list__item mb-2">
      <VaListItemSection avatar class="justify-center">
        <VaIcon name="group" color="black" />
      </VaListItemSection>

      <VaListItemSection>
        <VaListItemLabel>
          {{ group.name }}
        </VaListItemLabel>
      </VaListItemSection>

      <VaListItemSection icon style="cursor: pointer">
        <VaIcon class="" name="more_vert" />
      </VaListItemSection>
    </VaListItem>
    <!-- <VaListItem v-for="(contact, index) in contacts" :key="index" class="list__item mb-2">
      <VaListItemSection avatar class="justify-center">
        <VaAvatar size="small">
          <img :src="contact.img" :alt="contact.name" />
        </VaAvatar>
      </VaListItemSection>

      <VaListItemSection>
        <VaListItemLabel>
          {{ contact.name }}
          <VaIcon class="mr-2" name="no_accounts" />
        </VaListItemLabel>
        <VaListItemLabel caption>
          {{ contact.address }}
        </VaListItemLabel>
      </VaListItemSection>

      <VaListItemSection icon style="cursor: pointer">
        <VaIcon name="more_vert" color="black" />
      </VaListItemSection>
    </VaListItem> -->
  </VaList>
</template>

<script lang="ts" setup>
// const loading = ref(true)
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { ref, onMounted } from 'vue'
import { GroupTeacher } from './types'
const dataFilter = {
  keyword: '',
  pageNumber: 0,
  pageSize: 10,
  orderBy: ['id'],
}
const stores = useGroupTeacherStore()

const groupTeachers = ref<GroupTeacher[]>([])

const getTeacherGroups = () => {
  stores.getGroupTeachers(dataFilter).then((res) => {
    groupTeachers.value = res.data
  })
}
onMounted(() => {
  getTeacherGroups()
})
</script>
