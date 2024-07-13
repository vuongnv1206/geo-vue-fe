<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BinClass from './BinClass.vue'
import BinQuestion from './BinQuestion.vue'
import { TabsEnum } from './Bin.enum'

const { t } = useI18n()

const tabValue = ref(0)

const tabs = computed(() => [
  { id: 0, title: t('bin.tabExams') },
  { id: 1, title: t('bin.tabQuestions') },
])

const changeTab = (value: number) => {
  console.log(value)
}
</script>
<template>
  <VaTabs v-model="tabValue" @update:modelValue="changeTab">
    <template #tabs>
      <VaTab v-for="tab in tabs" :key="tab.id">
        {{ tab.title }}
      </VaTab>
    </template>
  </VaTabs>

  <BinClass v-if="tabValue === TabsEnum.Exam" />
  <BinQuestion v-if="tabValue === TabsEnum.Question" />
</template>
