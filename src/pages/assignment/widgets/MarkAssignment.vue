<script setup lang="ts">
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useToast, VaCardContent, VaButton, VaIcon, VaCard } from 'vuestic-ui'
import { AssignmentSub, AssignmentSubmission, MarkAssignment } from '../types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getErrorMessage, notifications, validators } from '@/services/utils'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import GeoAvatar from '@/components/avatar/GeoAvatar.vue'

const { t } = useI18n()
const loading = ref(true)
const router = useRouter()
const assignmentStores = useAssignmentStore()
const { init: notify } = useToast()

const assignmentId = router.currentRoute.value.params.id.toString()
const classId = router.currentRoute.value.params.classId.toString()
const studentId = router.currentRoute.value.params.studentId.toString()
const assignmentSub = ref<AssignmentSub>({
  assignmentId: assignmentId,
  classId: classId,
})
const url = (import.meta.env.VITE_APP_BASE_URL as string).slice(0, -3)
const attachmentPaths = ref<string[]>([])
const rawAttachmentPaths = ref<string[]>([])
const assignmentSubmission = ref<AssignmentSubmission[]>([])

const defaultMarkAssignment: MarkAssignment = {
  assignmentId: assignmentId,
  studentId: studentId,
  score: 0,
  comment: '',
}
const newMarkAssignment = ref({ ...defaultMarkAssignment })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newMarkAssignment.value).some((key) => {
    return newMarkAssignment.value[key as keyof MarkAssignment] !== defaultMarkAssignment?.[key as keyof MarkAssignment]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

const getAssignmentSubmissions = () => {
  loading.value = true
  assignmentStores
    .getAssignmentSubmissions(assignmentSub.value)
    .then((response) => {
      // Lọc ngay khi nhận dữ liệu từ API
      const filteredSubmissions = response.filter(
        (ass: any) => ass.studentId === studentId && ass.assignmentId === assignmentId,
      )

      // Kiểm tra và thay thế giá trị answerRaw
      filteredSubmissions.forEach((submission: any) => {
        if (submission.answerRaw === '<p><br></p>') {
          submission.answerRaw = ' '
        }
        if (submission.attachmentPath) {
          attachmentPaths.value = JSON.parse(submission.attachmentPath)
          rawAttachmentPaths.value = JSON.parse(submission.attachmentPath)
          for (let i = 0; i < attachmentPaths.value.length; i++) {
            const parts = attachmentPaths.value[i].split('_')
            const newPart = parts.slice(1).join('_')
            // attachmentPaths.value[i] = `${url}${newPart}`
            attachmentPaths.value[i] = `${newPart}`
          }
        }
      })
      assignmentSubmission.value = filteredSubmissions

      assignmentSubmission.value.forEach((element: any) => {
        if (element.score != null) {
          newMarkAssignment.value.score = element.score
          newMarkAssignment.value.comment = element.comment
        }
      })
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('assignments.assignment')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}
const onMarkAssignmentSubmit = async () => {
  assignmentStores
    .markAssignment(newMarkAssignment.value)
    .then(() => {
      notify({
        message: t('assignments.assignment'),
        color: 'success',
      })
      router.push({ name: 'assignment-details', params: { id: assignmentId, classId: classId } })
    })
    .catch((error) => {
      notify({
        message: t('assignments.assignment') + getErrorMessage(error),
        color: 'error',
      })
    })
}

onMounted(() => {
  getAssignmentSubmissions()
})
</script>

<template>
  <VaLayout>
    <VaButton
      icon="va-arrow-left"
      preset="plainOpacity"
      :to="{ name: 'assignment-details', param: { id: assignmentId, classId: classId } }"
    />
  </VaLayout>
  <VaDivider />
  <VaLayout class="h-[80vh]">
    <template #left>
      <div class="w-[55vw] bg-gray-200 p-4 mr-2 rounded-md h-full">
        <div v-for="ass in assignmentSubmission" :key="ass.assignmentId" class="h-full">
          <VaCard v-if="ass.status === 'Submmitted'" class="h-full">
            <VaCardTitle>{{ $t('assignments.attachments') }}</VaCardTitle>
            <VaCard v-for="(attachmentPath, index) in attachmentPaths" :key="index">
              <VaButton
                class="font-medium geo-text px-5"
                icon="description"
                size="small"
                preset="plain"
                :href="`${url}${rawAttachmentPaths[index]}`"
              >
                {{ attachmentPath }}
              </VaButton>
            </VaCard>
            <VaCardTitle>{{ $t('assignments.answers') }}</VaCardTitle>
            <VaScrollContainer class="max-h-[50vh]" vertical>
              <!-- eslint-disable vue/no-v-html -->
              <div class="text-md font-medium px-5 mb-4" v-html="ass.answerRaw"></div>
              <!-- eslint-enable -->
            </VaScrollContainer>
          </VaCard>

          <div v-else class="flex flex-col items-center h-full">
            <VaIcon name="description" size="3rem" class="mb-2" />
            <VaCardContent class="text-xl font-medium text-center">
              {{ t('assignments.is_not_submited') }}
            </VaCardContent>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div class="w-[33vw] bg-gray-200 p-4 h-full rounded-md">
        <VaCard v-for="ass in assignmentSubmission" :key="ass.assignmentId" class="h-full">
          <Vaform>
            <VaCard class="flex justify-between items-center p-4">
              <div class="flex items-center">
                <GeoAvatar
                  :size="42"
                  color="warning"
                  :image="ass.student.avatarUrl || undefined"
                  :txt="ass.student.firstName.charAt(0).toUpperCase()"
                />
                <VaCardContent>{{ ass.student.firstName }} {{ ass.student.lastName }}</VaCardContent>
              </div>
              <VaInput
                v-model="newMarkAssignment.score"
                class="w-24"
                :placeholder="$t('assignments.enter_score')"
                :rules="[
                  validators.required2($t('assignments.score')),
                  validators.isNumber($t('assignments.score')),
                  validators.minValue(0),
                  validators.maxValue(10),
                ]"
              />
            </VaCard>
            <VaCardTitle>{{ $t('assignments.comment') }}</VaCardTitle>
            <VaCard class="px-4">
              <QuillEditor
                v-model:content="newMarkAssignment.comment"
                class="border rounded w-full mx-auto"
                :placeholder="$t('posts.enter_content')"
                content-type="html"
                style="height: 200px"
              />
            </VaCard>
            <VaCard class="flex justify-end space-x-4 p-4">
              <VaButton :to="{ name: 'assignment-details', param: { id: assignmentId, classId: classId } }">{{
                $t('settings.cancel')
              }}</VaButton>
              <VaButton @click="onMarkAssignmentSubmit">{{ $t('settings.save') }}</VaButton>
            </VaCard>
          </Vaform>
        </VaCard>
      </div>
    </template>
  </VaLayout>
</template>
