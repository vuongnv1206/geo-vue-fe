<template>
  <VaDropdown
    v-model="doShowDropdown"
    trigger="none"
    :offset="[13, 0]"
    class="notification-dropdown"
    stick-to-edges
    :close-on-content-click="false"
  >
    <template #anchor>
      <VaButton preset="secondary" color="textPrimary" @click="doShowDropdown = !doShowDropdown">
        <VaBadge v-if="amountOfNewNotification > 0" overlap>
          <template #text>{{ amountOfNewNotification }}</template>
          <VaIconNotification class="notification-dropdown__icon" />
        </VaBadge>
        <VaIconNotification v-if="amountOfNewNotification <= 0" class="notification-dropdown__icon" />
      </VaButton>
    </template>
    <VaDropdownContent class="h-full sm:max-w-[420px] sm:h-auto">
      <div class="flex justify-between items-center">
        <VaButton preset="secondary" color="textPrimary" @click="handleSeeAll">{{ t('notifications.all') }} </VaButton>
        <VaDropdown placement="left-end">
          <template #anchor>
            <VaButton preset="secondary" color="textPrimary" class="rounded-full">
              <VaIcon name="more_horiz" class="" />
            </VaButton>
          </template>

          <VaDropdownContent>
            <p
              class="px-2 text-sm"
              :class="{
                'cursor-default': notificationsWithRelativeTime?.length <= 0 || allNotificationsRead,
                'cursor-pointer notification-hover': notificationsWithRelativeTime?.length > 0 && !allNotificationsRead,
              }"
              @click="handleMarkAllAsRead"
            >
              <VaIcon name="check" />
              Mark all as read
            </p>
          </VaDropdownContent>
        </VaDropdown>
      </div>
      <VaInnerLoading :loading="isLoading">
        <section class="sm:max-h-[350px] p-2 overflow-auto">
          <section v-if="notificationsWithRelativeTime?.length <= 0" class="flex flex-col items-center">
            <VaIcon name="notifications" color="secondary" size="4rem" />
            <p class="text-lg font-semibold">You do not have any notifications</p>
          </section>
          <VaList v-if="notificationsWithRelativeTime?.length > 0" class="space-y-1 mb-2">
            <template v-for="(item, index) in notificationsWithRelativeTime" :key="item?.id">
              <VaListItem
                class="p-1 text-base cursor-pointer notification-hover relative group"
                :class="{ 'notification-unread': !item?.isRead }"
                @click="handleClickToNotificationItem(item?.url, item?.id, item?.isRead)"
              >
                <VaListItemSection icon class="mx-0 p-0">
                  <VaIcon :name="item?.icon?.iconName" :color="item?.icon?.color" />
                </VaListItemSection>
                <VaListItemSection>
                  <p class="text-sm font-bold">{{ item?.title }}</p>
                  <p class="text-sm">{{ item?.message }}</p>
                  <p class="text-xs text-primary">{{ item?.createdOn }}</p>
                </VaListItemSection>
                <VaDropdown
                  placement="right-bottom"
                  class="z-50 absolute right-2 top-1/2 invisible group-hover:visible"
                >
                  <template #anchor>
                    <VaButton preset="secondary" color="textPrimary" class="rounded-full" @click.stop>
                      <VaIcon name="more_horiz" size="medium" />
                    </VaButton>
                  </template>

                  <VaDropdownContent>
                    <p class="py-1 px-3 cursor-pointer notification-hover" @click="handleToggleMarkAsRead(item?.id)">
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
    </VaDropdownContent>
  </VaDropdown>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import VaIconNotification from '../../../icons/VaIconNotification.vue'
import { useRouter } from 'vue-router'
import { NotificationType, PagingNotification, QueryGetNotification } from '@/pages/notification/types'
import notificationService from '@/services/notification.service'
import { getErrorMessage } from '@/services/utils'
import { useToast } from 'vuestic-ui/web-components'
import { IconColor, IconType, LabelType } from '@/pages/notification/Notification.enum'
import { useNotificationStore } from '@/stores/modules/notification.module'

const { t, locale } = useI18n()

const { init: notify } = useToast()
const rtf = new Intl.RelativeTimeFormat(locale.value, { style: 'short' })
const router = useRouter()
const doShowDropdown = ref(false)
const isLoading = ref(false)
const amountOfNewNotification = ref(0)
const showMoreButton = ref(false)
const pagination = ref<PagingNotification>({
  pageNumber: 1,
  pageSize: 5,
  totalPages: 0,
  currentPages: 0,
  hasNextPage: true,
})
const notifications = ref<NotificationType[]>([])

const getNotifications = async (data: QueryGetNotification, isSeeMore: boolean) => {
  isLoading.value = true
  await notificationService
    .getNotification(data)
    .then((response) => {
      if (isSeeMore) notifications.value = [...notifications.value, ...(response?.data?.data || [])]
      else notifications.value = response?.data?.data || []
      pagination.value = {
        pageNumber: data?.pageNumber,
        pageSize: pagination.value.pageSize,
        totalPages: response?.data?.totalPages,
        currentPages: response?.data?.currentPage,
        hasNextPage: response?.data?.hasNextPage,
      }
      showMoreButton.value = response?.data?.hasNextPage || false
      getAmountOfNewNotification()
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
    .updateReadStatus(id, null, true)
    .then(() => {
      const tempPageNumber = 1
      const tempPageSize = pagination.value.currentPages * pagination.value.pageSize
      const data = {
        pageNumber: tempPageNumber,
        pageSize: tempPageSize,
        isRead: undefined,
      }
      getNotifications(data, false)
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
  if (href) {
    router.push(href)
    doShowDropdown.value = false
  }
}

const handleShowMore = () => {
  if (pagination.value.hasNextPage) {
    pagination.value.pageNumber++
    const data = {
      pageNumber: pagination.value.pageNumber,
      pageSize: pagination.value.pageSize,
      isRead: undefined,
    }
    getNotifications(data, true)
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
      .updateReadAll(null, true)
      .then(() => {
        const tempPageNumber = 1
        const tempPageSize = pagination.value.currentPages * pagination.value.pageSize
        const data = {
          pageNumber: tempPageNumber,
          pageSize: tempPageSize,
          isRead: undefined,
        }
        getNotifications(data, false)
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

const getIconType = (lableType: number) => {
  if (lableType === LabelType.Information) {
    return { iconName: IconType.Information, color: IconColor.Information }
  }
  if (lableType === LabelType.Success) {
    return { iconName: IconType.Success, color: IconColor.Success }
  }
  if (lableType === LabelType.Warning) {
    return { iconName: IconType.Warning, color: IconColor.Warning }
  }
  if (lableType === LabelType.Error) {
    return { iconName: IconType.Error, color: IconColor.Error }
  }
  if (lableType === LabelType.Reminder) {
    return { iconName: IconType.Reminder, color: IconColor.Reminder }
  }
}

const getAmountOfNewNotification = async () => {
  await notificationService
    .getUnread()
    .then((response) => {
      amountOfNewNotification.value = response?.data || 0
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
}

watch(
  () => useNotificationStore().isRefreshData,
  (isRefreshData) => {
    if (isRefreshData?.status && isRefreshData?.isFromDropDown === false) {
      const tempPageNumber = 1
      const tempPageSize = pagination.value.currentPages * pagination.value.pageSize
      const data = {
        pageNumber: tempPageNumber,
        pageSize: tempPageSize,
        isRead: undefined,
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

onMounted(() => {
  const data = {
    pageNumber: pagination.value.pageNumber,
    pageSize: pagination.value.pageSize,
    isRead: undefined,
  }
  getNotifications(data, false)
})

const TIME_NAMES = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  year: 1000 * 60 * 60 * 24 * 365,
}

const handleSeeAll = () => {
  doShowDropdown.value = false
  router.push('/notification')
}

const getTimeName = (differenceTime: number) => {
  return Object.keys(TIME_NAMES).reduce(
    (acc, key) => (TIME_NAMES[key as keyof typeof TIME_NAMES] < differenceTime ? key : acc),
    'month',
  ) as keyof typeof TIME_NAMES
}

const showToastNotification = (notification: any) => {
  const icon = getIconType(notification?.label)
  notify({
    title: 'Notification',
    message: `
    <div>
      <p class="text-sm font-bold">${notification?.title}</p>
      <p class="text-sm">${notification?.message}</p>
      </div>
    </div>
    `,
    dangerouslyUseHtmlString: true,
    color: icon?.color || '#ffffff',
    position: 'bottom-right',
    onClick: () => handleClickToNotificationItem(notification?.url, notification?.id, notification?.isRead),
  })
}

const receiveNotificationFromServer = (type: string, notification: any) => {
  const tempPageNumber = 1
  const tempPageSize = pagination.value.currentPages * pagination.value.pageSize
  const data = {
    pageNumber: tempPageNumber,
    pageSize: tempPageSize,
    isRead: undefined,
  }
  getNotifications(data, false)
  showToastNotification(notification)
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
      const nextItemDifference = Math.round(currentUTCDate.getTime() - nextItemUTCDate.getTime())
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
  receiveNotificationFromServer,
})
</script>

<style lang="scss" scoped>
.notification-dropdown {
  cursor: pointer;

  .notification-dropdown__icon {
    position: relative;
    display: flex;
    align-items: center;
  }

  .va-dropdown__anchor {
    display: inline-block;
  }
}

.notification-hover:hover {
  background-color: var(--va-background-element) !important;
}

.notification-unread {
  background-color: var(--va-background-element) !important;
}
</style>
