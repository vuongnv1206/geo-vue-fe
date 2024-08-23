<script setup lang="ts">
import { ref, watch } from 'vue'
import { MonitorDetail, MonitorDetailResponse } from '../types'

const props = defineProps<{
  monitorDetails: MonitorDetailResponse | null
}>()

type Info = {
  property: string
  icon: string
  value: string
}

const infos = ref<Info[]>([])

function extractUniqueInfo(response: MonitorDetailResponse): Info[] {
  try {
    const uniqueDevices: { [key: string]: MonitorDetail } = {}
    console.log(response)
    response.data.forEach((item) => {
      if (item.deviceId === undefined || item.deviceId === null || item.deviceId === '') {
        return
      }
      if (!uniqueDevices[item.deviceId as string]) {
        uniqueDevices[item.deviceId as string] = item
      }
    })

    const uniqueInfoArray: Info[] = Object.values(uniqueDevices)
      .map((item) => [
        {
          property: 'Device ID',
          icon: 'fingerprint',
          value: item.deviceId || '',
        },
        {
          property: 'Device Name',
          icon: 'computer',
          value: item.deviceName || '',
        },
        {
          property: 'Device Type',
          icon: 'view_cozy',
          value: item.deviceType || '',
        },
        {
          property: 'Public IP',
          icon: 'public',
          value: item.publicIp || '',
        },
        {
          property: 'Local IP',
          icon: 'lan',
          value: item.localIp || '',
        },
      ])
      .flat()
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
)

const loading = ref<boolean>(true)

watch(
  () => infos.value,
  (newVal) => {
    if (newVal.length > 0) {
      loading.value = false
    }
  },
)
</script>

<template>
  <VaInnerLoading :loading="loading">
    <div class="va-table-responsive">
      <table class="va-table va-table--hoverable border min-w-[100%]">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="info in infos" :key="info.property">
            <td>
              <VaIcon class="material-icons"> {{ info.icon }} </VaIcon> {{ info.property }}
            </td>
            <td>{{ info.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </VaInnerLoading>
</template>
