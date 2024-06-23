<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const folderId = ref(route.params.folderId ?? null)
const basic = ref([])

const createPaperUseQuestionBank = () => {
  router.push({ name: 'create-paper-question-bank', params: { folderId: folderId.value } })
}

onMounted(() => {})
</script>

<template>
  <div style="display: flex; flex-direction: row; width: 100%">
    <div style="flex: 2; margin-right: 20px">
      <VaCard>
        <VaCardContent>
          <h1>Create New Test</h1>
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
              <p style="font-size: 18px; margin-top: 10px">Choose File or drag and drop File here</p>
              <p style="color: gray">Supported formats: .pdf, .docx, .xlsx.</p>
              <p style="color: gray">
                You can upload Exercise Files, Exam Papers, or Answer Sheets for offline grading.
                <a href="#">Learn more</a>
              </p>
            </div>
          </VaFileUpload>
          <div style="text-align: center; margin-top: 10px">
            <a href="#" style="margin-right: 5px">Sample GEO Pdf</a> |
            <a href="#" style="margin-left: 5px; margin-right: 5px">Sample GEO Docx</a> |
            <a href="#" style="margin-left: 5px; margin-right: 5px">Sample GEO True-False Docx</a> |
            <a href="#" style="margin-left: 5px">Offline Answer Sheet Excel File</a>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div style="flex: 1">
      <VaCard>
        <VaCardContent>
          <VaButton block outline color="primary" style="margin-bottom: 10px" @click="createPaperUseQuestionBank">
            <VaIcon name="edit" style="margin-right: 10px" /> Create Test/Exercise
          </VaButton>
          <p style="margin-left: 40px; color: gray">
            Use GEO's editor to create Exercises/Tests. Edit from available templates or Copy & Paste from various
            sources. <a href="#">Learn more</a>
          </p>

          <VaButton block outline color="primary" style="margin-bottom: 10px">
            <VaIcon name="business" style="margin-right: 10px" /> Create Test from Matrix
          </VaButton>
          <p style="margin-left: 40px; color: gray">
            Create multiple equivalent quality tests from the existing matrix design of Azota, providing basic structure
            information: time, number of questions, levels, and question formats.
            <a href="#">Learn more</a>
          </p>

          <VaButton block outline color="primary" style="margin-bottom: 10px">
            <VaIcon name="thumb_up" style="margin-right: 10px" /> Create Offline Test Manually
          </VaButton>

          <VaButton block outline color="primary">
            <VaIcon name="article" style="margin-right: 10px" /> Create Offline Test with Text
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
