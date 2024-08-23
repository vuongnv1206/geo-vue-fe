<script setup lang="ts">
import { ref, watch } from 'vue'
import { MonitorDetail, MonitorDetailResponse } from '../types'
import { format } from '@/services/utils'

const props = defineProps<{
  monitorDetails: MonitorDetailResponse | null
}>()

type Info = {
  time: string
  process: string[]
}
const infos = ref<Info[]>([])

function extractUniqueInfo(response: MonitorDetailResponse): Info[] {
  try {
    const uniqueDevices: { [key: string]: MonitorDetail } = {}
    console.log(response)
    response.data.forEach((item) => {
      if (!uniqueDevices[item.createdOn as string]) {
        uniqueDevices[item.createdOn as string] = item
      }
    })

    const uniqueInfoArray: Info[] = Object.values(uniqueDevices)
      .map((item) => [
        {
          time: item.createdOn || '',
          process: item.processLog?.split('|').filter((item) => item !== '') || [],
        },
      ])
      .flat()

      // remove item that process is empty
      .filter((item) => item.process.length > 0)

    // list suspicious process
    const suspiciousProcess = [
      'TeamViewer',
      'AnyDesk',
      'Chrome Remote Desktop',
      'UltraViewer',
      'AnyDesk',
      'Supremo',
      'AeroAdmin',
      'Ammyy Admin',
      'Remote Utilities',
      'Zoho Assist',
      'Splashtop',
      'LogMeIn',
      'GoToMyPC',
      'Join.me',
      'WebEx',
      'Zoom',
      'Microsoft Teams',
      'Skype',
      'Slack',
      'Discord',
      'Zalo PC',
      'Skype',
      'Viber',
      'Zalo',
      'Facebook',
      'Messenger',
      'WhatsApp',
      'Telegram',
      'Skype',
      'Viber',
    ]

    // add <div class="text-red-500"> {{ process }} </div> if process is suspicious
    uniqueInfoArray.forEach((item) => {
      item.process = item.process.map((process) => {
        // ingore case
        const processLowerCase = process.toLowerCase()
        const isSuspicious = suspiciousProcess.some((suspicious) => processLowerCase.includes(suspicious.toLowerCase()))
        if (isSuspicious) {
          return `<div class="text-red-500"><b>${process}</b></div>`
        }
        return process
      })
    })

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

const loading = ref<boolean>(true)

watch(
  () => infos.value,
  (newVal) => {
    if (newVal.length > 0) {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <VaInnerLoading :loading="loading">
    <div class="va-table-responsive">
      <VaScrollContainer class="max-h-[70vh]" vertical>
        <table class="va-table va-table--hoverable border min-w-[100%]">
          <thead>
            <tr>
              <th>Time</th>
              <th>Process</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="info in infos" :key="info.time">
              <td class="w-1/4">
                {{ format.formatDateStrSec(info.time) }}
              </td>
              <td>
                <table class="va-table va-table--hoverable border min-w-[100%]">
                  <tbody>
                    <tr v-for="process in info.process" :key="process">
                      <!-- eslint-disable-next-line vue/no-v-html-->
                      <td><div v-html="process"></div></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </VaScrollContainer>
    </div>
  </VaInnerLoading>
</template>
