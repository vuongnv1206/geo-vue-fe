<script lang="ts" setup>
//import { useSubmitPaperStore } from '@/stores/modules/submitPaper.module';
import { ref } from 'vue'
import { VaButton, VaCard } from 'vuestic-ui'

const showSidebar = ref(true)
//const submitPaperStore = useSubmitPaperStore()
const options = [
  { text: 'True', value: 'one' },
  { text: 'False', value: 'two' },
]

const activeOptions = ref<{ [key: string]: boolean }>({
  one: false,
  two: false,
})
</script>

<template>
  <VaLayout style="height: 85vh">
    <template #left>
      <VaCard v-if="showSidebar" style="min-width: 20rem; max-width: 30rem" bordered>
        <VaCardTitle>
          <div class="flex items-center">
            <VaAvatar size="small" class="mr-2"> N </VaAvatar>
            <p><b>Duc nguyen</b></p>
          </div>
        </VaCardTitle>
        <VaDivider />

        <VaCardContent>
          <VaCard class="va-text-secondary text-xs">
            <VaCardTitle class="flex justify-between bg-slate-200"> Thông tin chi tiết </VaCardTitle>

            <VaCardActions align="stretch" vertical>
              <VaListItem>
                <p><b>Điểm:</b> 5/10</p>
              </VaListItem>
              <VaListItem>
                <p><b>Trắc nghiệm:</b> 5 (2/3 câu)</p>
              </VaListItem>
              <VaListItem>
                <p><b>Tự luận:</b> <span style="color: red">Chưa chấm</span> (1 câu)</p>
              </VaListItem>
              <div>
                <p><b>Số file đã nộp:</b> 0</p>
              </div>
              <div>
                <p><b>Xem chi tiết quá trình làm bài:</b> <span class="icon">🔍</span></p>
              </div>
            </VaCardActions>
          </VaCard>
        </VaCardContent>
      </VaCard>
    </template>

    <template #content>
      <VaNavbar class="py-2 ml-1 flex justify-between items-center" shadowed bordered>
        <template #left>
          <VaNavbarItem class="navbar-item-slot">
            <div class="flex items-center">
              <VaButton :icon="showSidebar ? 'menu_open' : 'menu'" size="small" @click="showSidebar = !showSidebar" />
            </div>
          </VaNavbarItem>
        </template>
        <template #right>
          <VaNavbarItem class="navbar-item-slot">
            <VaMenu>
              <template #anchor>
                <VaButton icon="filter_list" size="small">Filter</VaButton>
              </template>
              <div class="p-4">
                <div v-for="option in options" :key="option.value" class="flex items-center mb-2">
                  <span class="mr-2">{{ option.text }}</span>
                  <VaSwitch v-model="activeOptions[option.value]" size="small" />
                </div>
              </div>
            </VaMenu>
          </VaNavbarItem>
        </template>
        <template #center>
          <VaNavbarItem class="navbar-item-slot"> Exam Name </VaNavbarItem>
        </template>
      </VaNavbar>
      <VaCard class="mt-2 ml-2" style="height: 80vh">
        <VaTabs stateful grow>
          <template #tabs>
            <VaTab v-for="title in ['Trắc nghiệm', 'Tự luận']" :key="title" :name="title">
              {{ title }}
            </VaTab>
          </template>
        </VaTabs>
        <VaCardContent>
          <!-- Nội dung tab Trắc nghiệm -->

          <div v-for="i in 3" :key="i" class="mt-4">
            <VaCard class="mb-4" :bordered="false" stripe stripe-color="success" outlined>
              <VaCardContent>
                <h4>Câu {{ i }}</h4>
                <p>
                  Trong cuộc khai thác thuộc địa lần thứ hai ở Đông Dương 1919-1929, thực dân Pháp tập trung đầu tư vào:
                </p>
                <div class="ml-4">
                  <p>A. Ngành chế tạo máy.</p>
                  <p>B. Công nghiệp hóa chất.</p>
                  <p>C. Đồn điền cao su.</p>
                  <p>D. Công nghiệp luyện kim.</p>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-red-500">Giải thích</span>
                  <span class="text-green-500">Đáp án đúng: A</span>
                </div>
              </VaCardContent>
            </VaCard>
          </div>
        </VaCardContent>
      </VaCard>
    </template>
  </VaLayout>
</template>
