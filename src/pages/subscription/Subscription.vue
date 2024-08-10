<template>
  <VaCard class="py-1 md:p-5">
    <h2 class="text-lg uppercase font-semibold ml-3">{{ t('subscription.choose_subscription') }}</h2>
    <VaCardContent>
      <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <VaCard
          v-for="item in listSubscriptions"
          :key="item?.id"
          class="hover:scale-105 transition-all border-2 border-solid border-slate-100 shadow-lg shadow-slate-400"
        >
          <VaCardContent class="flex flex-col items-center justify-between h-full">
            <div class="flex flex-col items-center w-full">
              <div class="flex flex-col items-center justify-center border-b-4 border-blue-600 border-solid p-7 w-full">
                <VaAvatar :icon="item?.image || 'group'" size="large" color="primary" text-color="#ffffff" />
                <p class="font-bold text-lg my-4">{{ item?.name || '' }}</p>
              </div>
              <div class="border-t-2 border-solid border-slate-200 my-5 py-2 w-full">
                <p>{{ item?.description || '' }}</p>
              </div>
            </div>
            <div class="flex flex-col items-center w-full">
              <div class="bg-blue-600 text-white font-bold w-full text-center py-4 text-lg">
                {{ getTextPrice(item?.price, item?.duration) }}
              </div>
              <VaButton
                class="uppercase my-5 py-2 px-3"
                color="#e8f4fe"
                text-color="primary"
                @click="() => handleShowConfirm(item)"
              >
                <VaIcon class="mr-2" name="credit_card" />
                {{ t('subscription.buy') }}</VaButton
              >
            </div>
          </VaCardContent>
        </VaCard>
      </section>
    </VaCardContent>
  </VaCard>
  <VaModal
    v-model="showConfirmBuy"
    :ok-text="t('subscription.yes')"
    size="small"
    :cancel-text="t('subscription.no')"
    @ok="handleConfirmOK"
  >
    <h3 class="va-h6">{{ t('subscription.confirmation_title') }}</h3>
    <p>{{ t('subscription.confirmation_text') }}</p>
  </VaModal>
  <VaModal v-model="showQR" hide-default-actions>
    <div class="flex flex-col justify-center items-center gap-8">
      <VaImage class="w-2/3" :src="srcQR" />
      <p class="font-semibold">{{ t('subscription.text_describe_qr') }}</p>
      <VaButton color="primary" @click="handleConfirmPaid">{{ t('subscription.confirm_paid') }}</VaButton>
    </div>
  </VaModal>
</template>
<script lang="ts" setup>
import subscriptionsService from '@/services/subscriptions.service'
import { getErrorMessage } from '@/services/utils'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vuestic-ui/web-components'
import { ACCOUNT_NAME, QR_URL } from './subscription.enum'
import { CreateOrderType, SubscriptionType } from './types'

const { t } = useI18n()
const { init: notify } = useToast()
const listSubscriptions = ref<SubscriptionType[]>([])
const curSubscriptions = ref<SubscriptionType>()
const showConfirmBuy = ref(false)
const showQR = ref(false)
const srcQR = ref('')

onMounted(() => {
  getSubscriptions()
})

const getSubscriptions = async () => {
  await subscriptionsService
    .getSubscriptions()
    .then((res) => {
      listSubscriptions.value = res?.data || []
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

const handleShowConfirm = (item: any) => {
  showConfirmBuy.value = true
  curSubscriptions.value = item
}

const handleConfirmPaid = () => {
  showQR.value = false
}

const handleConfirmOK = async () => {
  const data: CreateOrderType = { subscriptionId: curSubscriptions.value?.id || '' }
  handleCreateOrder(data)
}

const handleCreateOrder = async (data: CreateOrderType) => {
  await subscriptionsService
    .createOrder(data)
    .then((res) => {
      srcQR.value = `${QR_URL}?accountName=${ACCOUNT_NAME}&amount=${curSubscriptions.value?.price}&addInfo=${res?.data}`
      showQR.value = true
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

const getTextPrice = (price: number, duration: number) => {
  const formattedPrice = handleFormattedPrice(price)
  const year = duration / 12
  if (duration % 12 === 0) {
    return `${formattedPrice} for ${year} ${year > 1 ? 'years' : 'year'}`
  } else {
    return `${formattedPrice} for ${duration} ${duration > 1 ? 'months' : 'month'}`
  }
}

const handleFormattedPrice = (price: number) => {
  return price
    .toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
    .replace(/\./g, ',')
    .replace(/\u00A0/g, '')
}
</script>
