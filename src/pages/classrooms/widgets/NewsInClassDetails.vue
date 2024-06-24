<script lang="ts" setup>
import { VaButton, VaIcon } from 'vuestic-ui/web-components'

interface News {
  id: string
  classesId: string
  content: string
  isLockComment: boolean
  parentId: string
  numberLikeInTheNews: number
}

const news: News = {
  id: '1',
  classesId: '1',
  content: 'Hello',
  isLockComment: false,
  parentId: '1',
  numberLikeInTheNews: 0,
}
</script>
<template>
  <VaCard class="w-2/3 relative">
    <QuillEditor theme="snow" toolbar="full" class="h-20 sm:h-10 md:h-20 lg:h-30" />
    <VaCard class="absolute bottom-2 right-2">
      <VaButton>Post</VaButton>
      <VaButton>
        <VaIcon :name="news.isLockComment ? 'lock' : 'lock_open'" />
      </VaButton>
    </VaCard>
  </VaCard>
</template>

<style scoped></style>
