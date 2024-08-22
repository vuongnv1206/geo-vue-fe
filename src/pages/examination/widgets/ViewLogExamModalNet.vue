<script setup lang="ts">
import { ref, watch } from 'vue'
import { MonitorDetail, MonitorDetailResponse } from '../types'
import { format } from '@/services/utils'

const props = defineProps<{
  monitorDetails: MonitorDetailResponse | null
}>()

type Info = {
  time: string
  keys: string[]
}
const infos = ref<Info[]>([])

function extractUniqueInfo(response: MonitorDetailResponse): Info[] {
  try {
    const uniqueDevices: { [key: string]: MonitorDetail } = {}
    console.log(response)
    response.data.forEach((item) => {
      if (!uniqueDevices[item.networkLog as string]) {
        uniqueDevices[item.networkLog as string] = item
      }
    })

    const uniqueInfoArray: Info[] = Object.values(uniqueDevices)
      .map((item) => [
        {
          time: item.createdOn || '',
          keys: item.networkLog?.split('|').filter((item) => item !== '') || [],
        },
      ])
      .flat()

      // remove item that process is empty
      .filter((item) => item.keys.length > 0)

    return uniqueInfoArray
  } catch (error) {
    console.log(error)
    return []
  }
}

watch(
  () => props.monitorDetails,
  (newVal) => {
    if (newVal) {
      infos.value = extractUniqueInfo(newVal)
    }
  },
  { immediate: true },
)

const loading = ref<boolean>(false)
</script>

<template>
  <VaInnerLoading :loading="loading">
    <div class="va-table-responsive">
      <VaScrollContainer class="max-h-[70vh]" vertical>
        <table class="va-table va-table--hoverable border min-w-[100%]">
          <thead>
            <tr>
              <th>Time</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="info in infos" :key="info.time">
              <td class="w-1/4">
                {{ format.formatDateStrSec(info.time) }}
              </td>
              <td>
                <span v-for="process in info.keys" :key="process"> {{ process }} - </span>
              </td>
            </tr>
          </tbody>
        </table>
      </VaScrollContainer>
    </div>
  </VaInnerLoading>
</template>
