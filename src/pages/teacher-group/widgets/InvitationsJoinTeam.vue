<script setup lang="ts">
import { useJoinTeacherTeamStore } from '@/stores/modules/joinTeacherTeam.module'
import { InviteJoinTeacherTeamDto } from '../types'
import { onMounted, ref, watch } from 'vue'
import { getErrorMessage, InvitationStatusColor, InvitationStatusLabel } from '@/services/utils'
import { useToast } from 'vuestic-ui'

const props = defineProps<{
  searchFilter: string | null
}>()

const useJoinTeamStore = useJoinTeacherTeamStore()
const { init: notify } = useToast()

const data = ref<InviteJoinTeacherTeamDto[]>()
const loading = ref(true)

const getInvitationsJoinTeam = async (filter: string | null = null) => {
  loading.value = true
  try {
    const request = {}
    const res = await useJoinTeamStore.getInvitationTeacherNotInTeam(request)
    if (filter) {
      data.value = res.filter((item) => item.recipientEmail.includes(filter))
    } else {
      data.value = res
    }
    loading.value = false
  } catch (error) {
    notify({
      message: getErrorMessage(error),
      color: 'danger',
    })
    loading.value = false
  }
}

watch(
  () => props.searchFilter,
  async (newSearch) => {
    await getInvitationsJoinTeam(newSearch)
  },
  { immediate: true },
)

onMounted(async () => {
  await getInvitationsJoinTeam()
})
</script>

<template>
  <VaCard>
    <VaCardTitle>Invitations</VaCardTitle>
    <VaCardContent>
      <VaInnerLoading :loading="loading">
        <VaScrollContainer vertical>
          <VaList class="mb-2 max-h-[60vh]">
            <VaListItem v-for="item in data" :key="item.id" class="list__item">
              <VaListItemSection class="p-2">
                <VaListItemLabel>
                  {{ item.recipientEmail }}
                  <VaIcon v-if="!item.isRegistered" name="no_accounts" />
                  <VaBadge
                    :text="InvitationStatusLabel(item.status)"
                    :color="InvitationStatusColor(item.status)"
                    class="mr-2"
                  />
                </VaListItemLabel>
              </VaListItemSection>
            </VaListItem>
          </VaList>
        </VaScrollContainer>
      </VaInnerLoading>
    </VaCardContent>
  </VaCard>
</template>

<style lang="scss" scoped>
.list__item:hover {
  background-color: #f1f5f9;
}
</style>
