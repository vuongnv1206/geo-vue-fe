<template>
  <h1 class="font-bold text-xl">{{ t('subscription.orders.title') }}</h1>
  <VaCard class="my-4 rounded">
    <OrdersForm :handle-trigger-filter="handleTriggerFilter" />
    <OrdersTable :filter-queries="filterQueries" />
  </VaCard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import OrdersTable from './OrdersTable.vue'
import OrdersForm from './OrdersForm.vue'
import { ref } from 'vue'

const { t } = useI18n()
const filterQueries = ref({ status: null })

const handleTriggerFilter = (filterQuery: any) => {
  filterQueries.value = { ...filterQuery }
}
</script>
