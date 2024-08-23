<script setup lang="ts">
import { ref, watch } from 'vue'
import { MonitorDetail, MonitorDetailResponse } from '../types'
import { format } from '@/services/utils'

const props = defineProps<{
  monitorDetails: MonitorDetailResponse | null
}>()

type Info = {
  time: string
  keys: string
}
const infos = ref<Info[]>([])

function extractUniqueInfo(response: MonitorDetailResponse): Info[] {
  try {
    const uniqueDevices: { [key: string]: MonitorDetail } = {}
    console.log(response)
    const uniqueReassign: { [key: string]: MonitorDetail } = {}
    const uniqueSR: { [key: string]: MonitorDetail } = {}

    response.data.forEach((item) => {
      if (!uniqueDevices[item.commonLog as string]) {
        uniqueDevices[item.commonLog as string] = item
      }
      if (!uniqueReassign[item.reassignLog as string]) {
        uniqueReassign[item.reassignLog as string] = item
      }
      if (!uniqueSR[item.suspiciousReason as string]) {
        uniqueSR[item.suspiciousReason as string] = item
      }
    })
    const uniqueInfoArray: Info[] = Object.values(uniqueDevices)
      .map((item) => [
        {
          time: item.createdOn || '',
          keys: item.commonLog ? 'Common: ' + item.commonLog : '',
        },
      ])
      .flat()
      .filter((item) => item.keys.length > 0)

    const uniqueReassignArray: Info[] = Object.values(uniqueReassign)
      .map((item) => [
        {
          time: item.createdOn || '',
          keys: item.reassignLog ? 'Reassign: ' + item.reassignLog : '',
        },
      ])
      .flat()
      .filter((item) => item.keys.length > 0)

    const uniqueSRArray: Info[] = Object.values(uniqueSR)
      .map((item) => [
        {
          time: item.createdOn || '',
          keys: item.suspiciousReason ? 'Suspicious Reason: ' + item.suspiciousReason : '',
        },
      ])
      .flat()
      .filter((item) => item.keys.length > 0)

    uniqueInfoArray.push(...uniqueReassignArray)
    uniqueInfoArray.push(...uniqueSRArray)

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
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="info in infos" :key="info.time">
              <td class="w-1/4">
                {{ format.formatDateStrSec(info.time) }}
              </td>
              <td>
                {{ info.keys }}
              </td>
            </tr>
          </tbody>
        </table>
      </VaScrollContainer>
    </div>
  </VaInnerLoading>
</template>
