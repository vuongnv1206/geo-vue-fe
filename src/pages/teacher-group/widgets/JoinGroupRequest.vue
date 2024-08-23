<script setup lang="ts">
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GroupTeacher, SendRequestJoinGroupRequest } from '../types'
import { useToast } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()

const useTeacherGroup = useGroupTeacherStore()
const { init: notify } = useToast()
const { t } = useI18n()

const groupId = route.params.id as string

const groupDetail = ref<GroupTeacher>()
const loading = ref(true)

const requestJoin = ref<SendRequestJoinGroupRequest>({
  groupId: groupId,
  content: '',
})

const getTeacherGroupDetail = async (id: string) => {
  try {
    const response = await useTeacherGroup.getGuestGroupDetail(id)
    groupDetail.value = response
    loading.value = false
  } catch (error) {
    loading.value = false
    notify({
      message: notifications.getFailed(t('groupClasses.group_detail')) + getErrorMessage(error),
      color: 'danger',
    })
  }
}

const sendRequestJoin = async () => {
  loading.value = true
  try {
    await useTeacherGroup.sendRequestJoinGroup(requestJoin.value)
    loading.value = false
    notify({
      message: 'Send request successfully',
      color: 'success',
    })
    router.push({ name: 'join-request' })
  } catch (error) {
    loading.value = false
    notify({
      message: notifications.createFailed(getErrorMessage(error)),
      color: 'danger',
    })
  }
}

onMounted(async () => {
  await getTeacherGroupDetail(groupId)
})
</script>

<template>
  <VaInnerLoading :loading="loading">
    <VaCard>
      <VaCardContent class="min-h-[80vh] flex justify-center">
        <div class="text-center mt-3">
          <p class="va-h6 va-text-secondary">
            Join group: <span class="va-text-bold">{{ groupDetail?.name }}</span>
          </p>
          <p>Admin of group: {{ groupDetail?.adminGroup }}</p>
          <div>
            <VaTextarea v-model="requestJoin.content" placeholder="What purpose?" />
          </div>
          <VaButton class="m-2" color="success" @click="sendRequestJoin()">Join group</VaButton>
        </div>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
</template>
