<template>
  <VaCard class="p-2 ml-1 rounded mb-2">
    <VaCardTitle>Member in group: SWD</VaCardTitle>
    <VaDivider />
    <VaCardContent class="p-0">
      <div class="flex gap-2 flex-wrap">
        <div class="text-center">
          <VaAvatar color="success" size="small">
            <VaIcon name="add" />
          </VaAvatar>
        </div>
        <VaAvatar color="info" size="small"> J.D. </VaAvatar>
        <VaAvatar color="warning" size="small"> J.D. </VaAvatar>
        <VaAvatar color="#fafaa0" size="small"> J.D. </VaAvatar>
        <VaAvatar color="danger" size="small"> J.D. </VaAvatar>
        <VaAvatar color="#692BEB" size="small"> J.D. </VaAvatar>
        <VaAvatar color="#540C0C" size="small"> J.D. </VaAvatar>
      </div>
    </VaCardContent>
  </VaCard>
  <VaCard class="p-2 ml-1 rounded">
    <VaCardTitle>Permission management</VaCardTitle>
    <VaDivider />
    <VaCardContent class="p-0 mb-2">
      <VaInput placeholder="search class" />
    </VaCardContent>
    <div class="grid md:grid-cols-4 sm:grid-cols-3 gap-3">
      <VaCard stripe stripe-color="success" class="border flex flex-col">
        <VaCardTitle>SE1644</VaCardTitle>
        <VaCardContent>
          <VaOptionList
            v-model="listValue"
            :options="['Giao bài tập, giao đề thi', 'Chấm bài', 'Quản lý danh sách học sinh']"
          />
        </VaCardContent>
      </VaCard>
      <VaCard stripe stripe-color="success" class="border flex flex-col">
        <VaCardTitle>SE1644</VaCardTitle>
        <VaCardContent>
          <VaOptionList
            v-model="listValue"
            :options="['Giao bài tập, giao đề thi', 'Chấm bài', 'Quản lý danh sách học sinh']"
          />
        </VaCardContent>
      </VaCard>
      <VaCard stripe stripe-color="success" class="border flex flex-col">
        <VaCardTitle>SE1644</VaCardTitle>
        <VaCardContent>
          <VaOptionList
            v-model="listValue"
            :options="['Giao bài tập, giao đề thi', 'Chấm bài', 'Quản lý danh sách học sinh']"
          />
        </VaCardContent>
      </VaCard>
      <VaCard stripe stripe-color="success" class="border flex flex-col">
        <VaCardTitle>SE1644</VaCardTitle>
        <VaCardContent>
          <VaOptionList
            v-model="listValue"
            :options="['Giao bài tập, giao đề thi', 'Chấm bài', 'Quản lý danh sách học sinh']"
          />
        </VaCardContent>
      </VaCard>
      <VaCard stripe stripe-color="success" class="border flex flex-col">
        <VaCardTitle>SE1644</VaCardTitle>
        <VaCardContent>
          <VaOptionList
            v-model="listValue"
            :options="['Giao bài tập, giao đề thi', 'Chấm bài', 'Quản lý danh sách học sinh']"
          />
        </VaCardContent>
      </VaCard>
    </div>
  </VaCard>
</template>

<script lang="ts">
export default {
  data() {
    return {
      listValue: [],
    }
  },
}
</script>
