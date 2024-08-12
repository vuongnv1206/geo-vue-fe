<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { getErrorMessage } from '@/services/utils'
import { UserDetail } from '../user/types'
import { useUserProfileStore } from '@/stores/modules/user.module'
import { useJoinTeacherTeamStore } from '@/stores/modules/joinTeacherTeam.module'
import { SendRequestJoinTeamRequest } from './types'

const route = useRoute()

const useUserService = useUserProfileStore()
const useJoinTeacherTeam = useJoinTeacherTeamStore()
const { init: notify } = useToast()

const adminTeamId = route.params.userId as string

const adminDetail = ref<UserDetail>()
const loading = ref(true)

const getUserDetail = async (userId: string) => {
  try {
    const res = await useUserService.getUserDetail(userId)
    adminDetail.value = res
    loading.value = false
  } catch (error) {
    notify({
      message: getErrorMessage(error),
      color: 'danger',
    })
    loading.value = false
  }
}

const requestJoinTeamRequest = ref<SendRequestJoinTeamRequest>({
  adminTeamId: adminTeamId,
  content: '',
})

const sendRequestJoinTeam = async () => {
  loading.value = true
  try {
    await useJoinTeacherTeam.sendRequestJoinTeam(requestJoinTeamRequest.value)
    loading.value = false
    notify({
      message: 'Send request successfully',
      color: 'success',
    })
  } catch (error) {
    loading.value = false
    notify({
      message: getErrorMessage(error),
      color: 'danger',
    })
  }
}

onMounted(async () => {
  await getUserDetail(adminTeamId)
})
</script>

<template>
  <VaInnerLoading :loading="loading">
    <VaCard>
      <VaCardContent class="min-h-[80vh] flex justify-center">
        <div class="text-center mt-3">
          <p class="va-h6 va-text-secondary">
            Join team: <span class="va-text-bold">{{ adminDetail?.email }}</span>
          </p>
          <p>Send request join team</p>
          <div>
            <VaTextarea v-model="requestJoinTeamRequest.content" placeholder="What purpose?" />
          </div>
          <VaButton class="m-2" color="success" @click="sendRequestJoinTeam()">Join team</VaButton>
        </div>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
</template>
