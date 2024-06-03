<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vuestic-ui'

const route = useRoute()
const folderId = ref(route.params.folderId ?? null)
const basic = ref([])

onMounted(() => {
  const { init: notify } = useToast()
  notify({
    message: `Folder ID: ${folderId.value}`,
    color: 'info',
  })
})
</script>

<template>
  <div style="display: flex; flex-direction: row; width: 100%">
    <div style="flex: 2; margin-right: 20px">
      <VaCard>
        <VaCardContent>
          <h1>Tạo đề mới</h1>
          <VaFileUpload
            v-model="basic"
            dropzone
            style="border: 2px dashed #ccc; height: 600px; display: flex; align-items: center; justify-content: center"
          >
            <div style="text-align: center">
              <VaIcon
                name="cloud-upload"
                size="60"
                color="primary"
                style="line-height: initial; display: block; margin: 0 auto"
              />
              <p style="font-size: 18px; margin-top: 10px">Chọn File hoặc kéo thả File vào đây</p>
              <p style="color: gray">Hỗ trợ các định dạng .pdf, .docx, .xlsx.</p>
              <p style="color: gray">
                Có thể Upload File Bài tập, Đề thi Hoặc Bảng đáp án để chấm offline. <a href="#">Tìm hiểu thêm</a>
              </p>
            </div>
          </VaFileUpload>
          <div style="text-align: center; margin-top: 10px">
            <a href="#" style="margin-right: 5px">Đề mẫu GEO Pdf</a> |
            <a href="#" style="margin-left: 5px; margin-right: 5px">Đề mẫu GEO Docx</a> |
            <a href="#" style="margin-left: 5px; margin-right: 5px">Đề mẫu GEO Đúng-Sai Docx</a> |
            <a href="#" style="margin-left: 5px">File Excel bảng đáp án đề Offline</a>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div style="flex: 1">
      <VaCard>
        <VaCardContent>
          <VaButton block outline color="primary" style="margin-bottom: 10px">
            <VaIcon name="edit" style="margin-right: 10px" /> Tự soạn Đề thi / Bài tập
          </VaButton>
          <p style="margin-left: 40px; color: gray">
            Sử dụng trình soạn thảo của GEO để tạo Bài tập/Đề thi. Chỉnh sửa từ các mẫu có sẵn hoặc Copy & Paste từ các
            nguồn khác nhau. <a href="#">Tìm hiểu thêm</a>
          </p>

          <VaButton block outline color="primary" style="margin-bottom: 10px">
            <VaIcon name="business" style="margin-right: 10px" /> Tạo đề từ Ma trận đề
          </VaButton>
          <p style="margin-left: 40px; color: gray">
            Tạo ra nhiều đề kiểm tra với chất lượng tương đương từ bản thiết kế ma trận đề có sẵn của Azota, cung cấp
            các thông tin cấu trúc cơ bản của đề kiểm tra: thời gian, số câu hỏi, cấp độ và dạng thức câu hỏi.
            <a href="#">Tìm hiểu thêm</a>
          </p>

          <VaButton block outline color="primary" style="margin-bottom: 10px">
            <VaIcon name="thumb_up" style="margin-right: 10px" /> Tạo đề offline thủ công
          </VaButton>

          <VaButton block outline color="primary">
            <VaIcon name="article" style="margin-right: 10px" /> Tạo đề thi offline bằng Text
          </VaButton>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.custom-upload-file-area {
  width: max-content;
  padding: 1rem;
  border: 1px solid #cccccc;
  text-align: center;
}
</style>
