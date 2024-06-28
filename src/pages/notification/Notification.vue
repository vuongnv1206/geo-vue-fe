<template>
  <VaCard class="md:mx-64">
    <VaCardTitle class="flex justify-between">
      <p class="text-xl">Notifications</p>
      <VaDropdown placement="right-bottom">
        <template #anchor>
          <VaButton preset="secondary" color="textPrimary" class="rounded-full">
            <VaIcon name="more_horiz" size="large" class="" />
          </VaButton>
        </template>

        <VaDropdownContent>
          <p
            class="py-1 px-3"
            :class="{
              'cursor-default': notificationsWithRelativeTime?.length <= 0 || allNotificationsRead,
              'cursor-pointer': notificationsWithRelativeTime?.length > 0 && !allNotificationsRead,
            }"
            @click="handleMarkAllAsRead"
          >
            <VaIcon name="check" class="mr-1" />
            Mark all as read
          </p>
        </VaDropdownContent>
      </VaDropdown>
    </VaCardTitle>
    <VaCardContent>
      <VaInnerLoading :loading="isLoading">
        <div class="mb-2">
          <VaButton
            round
            size="small"
            :preset="isActiveButtonAll ? 'primary' : 'secondary'"
            class="mr-2"
            @click="handleFilterNotification(true)"
          >
            All
          </VaButton>
          <VaButton
            round
            size="small"
            :preset="!isActiveButtonAll ? 'primary' : 'secondary'"
            class=""
            @click="handleFilterNotification(false)"
          >
            Unread
          </VaButton>
        </div>
        <section class="py-4 overflow-auto">
          <section v-if="notificationsWithRelativeTime?.length <= 0" class="flex flex-col items-center">
            <VaIcon name="notifications" color="secondary" size="4rem" />
            <p class="text-lg font-semibold">You do not have any notifications</p>
          </section>
          <VaList v-if="notificationsWithRelativeTime?.length > 0" class="space-y-1 mb-2">
            <template v-for="(item, index) in notificationsWithRelativeTime" :key="item?.id">
              <VaListItem
                preset="secondary"
                class="p-2 text-base cursor-pointer relative group notification-hover"
                :class="{ 'notification-unread': !item?.isRead }"
                @click="handleClickToNotificationItem(item?.url, item?.id, item?.isRead)"
              >
                <VaListItemSection icon class="mx-0 p-0">
                  <VaIcon :name="item?.icon?.iconName" :color="item?.icon?.color" />
                </VaListItemSection>
                <VaListItemSection class="">
                  <p class="text-base font-semibold">{{ item?.title }}</p>
                  <p class="text-sm">{{ item?.message }}</p>
                  <p class="text-sm text-primary">{{ item?.createdOn }}</p>
                </VaListItemSection>
                <VaDropdown
                  placement="right-bottom"
                  class="z-50 absolute right-2 top-1/2 invisible group-hover:visible"
                >
                  <template #anchor>
                    <VaButton preset="secondary" color="textPrimary" class="rounded-full" @click.stop>
                      <VaIcon name="more_horiz" size="large" />
                    </VaButton>
                  </template>

                  <VaDropdownContent>
                    <p class="py-1 px-3 cursor-pointer" @click="handleToggleMarkAsRead(item?.id)">
                      <VaIcon name="check" class="mr-1" />
                      {{ item?.isRead ? 'Mark as unread' : 'Mark as read' }}
                    </p>
                  </VaDropdownContent>
                </VaDropdown>
              </VaListItem>
              <VaListSeparator
                v-if="item?.separator && index !== notificationsWithRelativeTime.length - 1"
                class="mx-3"
              />
            </template>
          </VaList>

          <VaButton
            v-if="showMoreButton && notificationsWithRelativeTime.length > 0"
            preset="primary"
            class="w-full"
            @click="handleShowMore"
            >{{ t('notifications.more') }}
          </VaButton>
        </section>
      </VaInnerLoading>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconColor, IconType, LabelType } from './Notification.enum'
import notificationService from '@/services/notification.service'
import { NotificationType, PagingNotification, QueryGetNotification } from './types'
import { useToast } from 'vuestic-ui/web-components'
import { getErrorMessage } from '@/services/utils'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/modules/notification.module'

const { t, locale } = useI18n()

const { init: notify } = useToast()
const router = useRouter()
const rtf = new Intl.RelativeTimeFormat(locale.value, { style: 'short' })
const showMoreButton = ref(false)
const isActiveButtonAll = ref(true)
const isLoading = ref(false)
const pagination = ref<PagingNotification>({
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
  currentPages: 0,
  hasNextPage: true,
})
const notifications = ref<NotificationType[]>([])

const getNotifications = async (data: QueryGetNotification, oldFilterType: boolean | undefined) => {
  isLoading.value = true
  await notificationService
    .getNotification(data)
    .then((response) => {
      if (oldFilterType !== data.isRead) notifications.value = response?.data?.data || []
      else notifications.value = [...notifications.value, ...(response?.data?.data || [])]
      pagination.value = {
        pageNumber: data?.pageNumber,
        pageSize: pagination.value.pageSize,
        totalPages: response?.data?.totalPages,
        currentPages: response?.data?.currentPage,
        hasNextPage: response?.data?.hasNextPage,
      }
      showMoreButton.value = response?.data?.hasNextPage || false
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}

const handleUpdateReadStatus = async (id: string) => {
  isLoading.value = true
  await notificationService
    .updateReadStatus(id, null, false)
    .then(() => {
      const oldFilterType = !isActiveButtonAll.value
      const tempPageNumber = 1
      const tempPageSize = pagination.value.currentPages * pagination.value.pageSize
      const data = {
        pageNumber: tempPageNumber,
        pageSize: tempPageSize,
        isRead: isActiveButtonAll.value ? undefined : false,
      }
      getNotifications(data, oldFilterType)
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
    .finally(() => (isLoading.value = false))
}

const handleClickToNotificationItem = async (href: string, id: string, isRead: boolean) => {
  if (!isRead) {
    handleUpdateReadStatus(id)
  }
  if (href) router.push(href)
}

const handleFilterNotification = async (isSelectedButtonAll: boolean) => {
  const oldFilterType = isActiveButtonAll.value ? undefined : false
  const curSelectedFilterType = isSelectedButtonAll ? undefined : false
  isActiveButtonAll.value = isSelectedButtonAll
  if (oldFilterType !== curSelectedFilterType) pagination.value.pageNumber = 1
  const data = {
    pageNumber: pagination.value.pageNumber,
    pageSize: pagination.value.pageSize,
    isRead: curSelectedFilterType,
  }
  getNotifications(data, oldFilterType)
}

const handleShowMore = () => {
  if (pagination.value.hasNextPage) {
    const oldFilterType = isActiveButtonAll.value ? undefined : false
    pagination.value.pageNumber++
    const data = {
      pageNumber: pagination.value.pageNumber,
      pageSize: pagination.value.pageSize,
      isRead: isActiveButtonAll.value ? undefined : false,
    }
    getNotifications(data, oldFilterType)
  }
}

const handleToggleMarkAsRead = async (id: string) => {
  if (id) {
    handleUpdateReadStatus(id)
  }
}

const handleMarkAllAsRead = async () => {
  if (notificationsWithRelativeTime.value?.length > 0 && !allNotificationsRead.value) {
    isLoading.value = true
    await notificationService
      .updateReadAll(null, false)
      .then(() => {
        const oldFilterType = !isActiveButtonAll.value
        const tempPageNumber = 1
        const tempPageSize = pagination.value.currentPages * pagination.value.pageSize
        const data = {
          pageNumber: tempPageNumber,
          pageSize: tempPageSize,
          isRead: isActiveButtonAll.value ? undefined : false,
        }
        getNotifications(data, oldFilterType)
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        notify({
          title: 'Error',
          message: message,
          color: 'danger',
        })
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}

const getIconType = (labelType: number) => {
  if (labelType === LabelType.Information) {
    return { iconName: IconType.Information, color: IconColor.Information }
  }
  if (labelType === LabelType.Warning) {
    return { iconName: IconType.Warning, color: IconColor.Warning }
  }
  if (labelType === LabelType.Error) {
    return { iconName: IconType.Error, color: IconColor.Error }
  }
  if (labelType === LabelType.Success) {
    return { iconName: IconType.Success, color: IconColor.Success }
  }
  if (labelType === LabelType.Reminder) {
    return { iconName: IconType.Reminder, color: IconColor.Reminder }
  }
}

watch(
  () => useNotificationStore().isRefreshData,
  (isRefreshData) => {
    if (isRefreshData?.status && isRefreshData?.isFromDropDown === true) {
      const tempPageNumber = 1
      const tempPageSize = pagination.value.currentPages * pagination.value.pageSize
      const data = {
        pageNumber: tempPageNumber,
        pageSize: tempPageSize,
        isRead: isActiveButtonAll.value ? undefined : false,
      }
      getNotifications(data, false)
      useNotificationStore().setRefreshData({
        status: false,
        isFromDropDown: null,
      })
    }
  },
  { immediate: true },
)

onMounted(async () => {
  const oldFilterType = isActiveButtonAll.value ? undefined : false
  const data = {
    pageNumber: pagination.value.pageNumber,
    pageSize: pagination.value.pageSize,
    isRead: isActiveButtonAll.value ? undefined : false,
  }
  getNotifications(data, oldFilterType)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const receiveNotification = (type: string, notification: any) => {
  const tempPageNumber = 1
  const tempPageSize = pagination.value.currentPages * pagination.value.pageSize
  const data = {
    pageNumber: tempPageNumber,
    pageSize: tempPageSize,
    isRead: undefined,
  }
  getNotifications(data, false)
}

const TIME_NAMES = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  year: 1000 * 60 * 60 * 24 * 365,
}

const getTimeName = (differenceTime: number) => {
  return Object.keys(TIME_NAMES).reduce(
    (acc, key) => (TIME_NAMES[key as keyof typeof TIME_NAMES] < differenceTime ? key : acc),
    'month',
  ) as keyof typeof TIME_NAMES
}

const convertToUTC = (date: string | Date): Date => {
  const localDate = new Date(date)
  return new Date(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds(),
  )
}

const notificationsWithRelativeTime = computed(() => {
  if (notifications.value.length <= 0) return notifications.value
  return notifications.value.map((item: any, index: number) => {
    const currentUTCDate = convertToUTC(new Date())
    const itemUTCDate = convertToUTC(item?.createdOn)
    const timeDifference = Math.round(currentUTCDate.getTime() - itemUTCDate.getTime())
    const timeName = getTimeName(timeDifference)
    let separator = false
    const nextItem = notifications.value[index + 1]
    if (nextItem) {
      const nextItemUTCDate = convertToUTC(nextItem?.createdOn)
      const nextItemDifference = Math.round(itemUTCDate.getTime() - nextItemUTCDate.getTime())
      const nextItemTimeName = getTimeName(nextItemDifference)

      if (timeName !== nextItemTimeName) {
        separator = true
      }
    }
    return {
      ...item,
      createdOn: rtf.format(-1 * Math.round(timeDifference / TIME_NAMES[timeName]), timeName),
      separator,
      icon: getIconType(item?.label),
    }
  })
})

const allNotificationsRead = computed(() => {
  return notificationsWithRelativeTime.value?.every((item: any) => item?.isRead)
})

defineExpose({
  receiveNotification,
})
</script>
<style scoped>
.notification-hover:hover {
  background-color: var(--va-background-element) !important;
}
.notification-unread {
  background-color: var(--va-background-element) !important;
}
</style>
