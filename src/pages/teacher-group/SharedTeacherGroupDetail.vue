<script setup lang="ts">
import { ref, watch } from 'vue'
import { AssignedClassroomInGroup, GroupTeacher } from './types'
import { useToast } from 'vuestic-ui'
import QrcodeVue from 'qrcode.vue'
import { useI18n } from 'vue-i18n'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { getErrorMessage, notifications } from '@/services/utils'
import { useRouter } from 'vue-router'

const props = defineProps<{
  groupDetail: GroupTeacher
}>()

const router = useRouter()

const groupTeachStore = useGroupTeacherStore()
const { init: notify } = useToast()

const { t } = useI18n()

const qrCodeSrc = ref<string | null>(null)
const baseUrl = window.location.origin
const copyJoinLink = (linkCopy: string) => {
  if (linkCopy) {
    navigator.clipboard
      .writeText(`${baseUrl}/${linkCopy}`)
      .then(() => {
        notify({
          message: 'Copy successfully',
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: `Failed to copy. ${error}`,
        })
      })
  }
}

const downloadQRCode = () => {
  const canvas = document.querySelector('canvas')
  if (canvas) {
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${props.groupDetail.name}qr_code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    notify({
      message: 'Failed to download QR code. Canvas not found.',
      color: 'danger',
    })
  }
}

const assignedClassroom = ref<AssignedClassroomInGroup[]>([])
const getGroupDetail = async () => {
  try {
    const response = await groupTeachStore.getGroupDetail(props.groupDetail.id)
    assignedClassroom.value = response.groupPermissionInClasses.reduce((acc: any, curr: any) => {
      const existingClass = acc.find((item: any) => item.classId === curr.classId)
      if (existingClass) {
        // Nếu classId đã tồn tại, thêm permissionType vào mảng
        existingClass.permissionType.push(curr.permissionType)
      } else {
        // Nếu classId chưa tồn tại, tạo một đối tượng mới
        acc.push({
          ...curr,
          permissionType: [curr.permissionType], // Khởi tạo mảng với permissionType đầu tiên
        })
      }
      return acc
    }, [])
  } catch (error) {
    notify({
      message: notifications.getFailed(t('groupClasses.group_detail')) + getErrorMessage(error),
      color: 'danger',
    })
  }
}

const getAllPermissionType: any[] = [
  { label: 'Assign Assignment', id: 'AssignAssignment' },
  { label: 'Marking', id: 'Marking' },
  { label: 'Manage Student', id: 'ManageStudentList' },
]

watch(
  () => props.groupDetail.joinLink,
  (newLink) => {
    if (newLink) {
      qrCodeSrc.value = `${baseUrl}/${newLink}`
      getGroupDetail()
    }
  },
  { immediate: true },
)

// Component for permission items
// const PermissionItem = defineComponent({
//   props: {
//     label: {
//       type: String,
//       required: true,
//     },
//     exists: {
//       type: Boolean,
//       required: true,
//     },
//   },
//   setup(props: any) {
//     const iconName = props.exists ? 'check_box' : 'disabled_by_default'
//     const iconColor = props.exists ? 'success' : 'secondary'
//     return { iconName, iconColor }
//   },
//   template: `
//     <span class="flex gap-2">
//       <VaIcon :name="iconName" :color="iconColor" />
//       {{ label }}
//     </span>
//   `,
// })

const directToClassroom = (classroomId: string) => {
  router.push({ name: 'class-details', params: { id: classroomId } })
}
</script>

<template>
  <VaCard class="mb-2">
    <VaCardContent class="flex gap-2">
      <VaButton preset="secondary" border-color="primary" size="small" @click="copyJoinLink(groupDetail.joinLink || '')"
        >Link invite</VaButton
      >
      <VaDropdown>
        <template #anchor>
          <VaButton icon="qr_code_2" preset="secondary" border-color="primary" size="small" />
        </template>
        <VaDropdownContent>
          <div>
            <QrcodeVue v-if="qrCodeSrc" :value="qrCodeSrc" />
            <div>
              <div>
                <VaButton preset="secondary" size="small" @click="downloadQRCode">download</VaButton>
              </div>
            </div>
          </div>
        </VaDropdownContent>
      </VaDropdown>
      <span>Manager: {{ groupDetail.adminGroup }}</span>
    </VaCardContent>
  </VaCard>
  <VaCard class="mb-2">
    <VaCardTitle>
      <div class="flex gap-2 flex-wrap align-center">
        <span>Member: </span>
        <div v-for="teacher in groupDetail?.teacherTeams" :key="teacher.id">
          <VaDropdown trigger="hover">
            <template #anchor>
              <VaAvatar color="info" size="small" class="text-center">
                {{
                  teacher.teacherName
                    .split(' ')
                    .filter((_, index, array) => index === 0 || index === array.length - 1)
                    .map((w) => w.charAt(0).toUpperCase())
                    .join('')
                }}
              </VaAvatar>
            </template>
            <VaDropdownContent> {{ teacher.email }} </VaDropdownContent>
          </VaDropdown>
        </div>
      </div>
    </VaCardTitle>
  </VaCard>
  <VaCard class="min-h-[60vh]">
    <VaCardTitle> {{ t('teacherGroups.permission_management') }}: {{ groupDetail?.name }} </VaCardTitle>
    <VaDivider />
    <VaInnerLoading :loading="groupDetail == null">
      <VaCardContent>
        <VaInput :placeholder="t('teacherGroups.search_class')" />
      </VaCardContent>
      <VaCardContent>
        <VaScrollContainer vertical>
          <div class="grid md:grid-cols-4 sm:grid-cols-3 gap-3">
            <div v-for="classroom in assignedClassroom" :key="classroom.id">
              <VaCard outlined stripe stripe-color="success">
                <VaCardTitle class="cursor-pointer" @click="directToClassroom(classroom.classId)">{{
                  classroom.className
                }}</VaCardTitle>
                <VaCardContent>
                  <template v-for="(permission, index1) in getAllPermissionType" :key="index1">
                    <span class="flex gap-2">
                      <VaIcon
                        :name="classroom.permissionType.includes(permission.id) ? 'check_box' : 'disabled_by_default'"
                        :color="classroom.permissionType.includes(permission.id) ? 'success' : 'secondary'"
                      />
                      {{ permission.label }}
                    </span>
                  </template>
                </VaCardContent>
              </VaCard>
            </div>
          </div>
        </VaScrollContainer>
      </VaCardContent>
    </VaInnerLoading>
  </VaCard>
</template>
