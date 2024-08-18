<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const folderId = ref(route.params.folderId ?? null)
const basic = ref([])

const createPaperUseQuestionBank = () => {
  router.push({ name: 'create-paper-question-bank', params: { folderId: folderId.value } })
}

const createPaperUseMatrix = () => {
  router.push({ name: 'create-paper-matrix', params: { folderId: folderId.value } })
}

onMounted(() => {})
</script>

<template>
  <div style="display: flex; flex-direction: row; width: 100%">
    <div style="flex: 2; margin-right: 20px">
      <VaCard>
        <VaCardContent>
          <h1>{{ t('papers.create_test') }}</h1>
          <VaFileUpload
            v-model="basic"
            dropzone
            :upload-button-text="$t('file_upload.upload_button_text')"
            :drop-zone-text="$t('file_upload.drop_zone_text')"
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
              <p style="color: gray">{{ t('papers.supported_format') }}</p>
              <p style="color: gray">
                {{ t('papers.content_0') }}
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
            <VaIcon name="edit" style="margin-right: 10px" /> {{ t('papers.create_test') }}
          </VaButton>
          <p style="margin-left: 40px; color: gray">
            {{ t('papers.content_1') }}
            <a href="#">Learn more</a>
          </p>

          <VaButton block outline color="primary" style="margin-bottom: 10px" @click="createPaperUseMatrix">
            <VaIcon name="business" style="margin-right: 10px" /> {{ t('papers.create_test_from_matrix') }}
          </VaButton>
          <p style="margin-left: 40px; color: gray">
            {{ t('papers.content_2') }}
            <a href="#">Learn more</a>
          </p>

          <!-- <VaButton block outline color="primary" style="margin-bottom: 10px">
            <VaIcon name="thumb_up" style="margin-right: 10px" /> {{ t('papers.create_offline_test_manually') }}
          </VaButton>

          <VaButton block outline color="primary">
            <VaIcon name="article" style="margin-right: 10px" /> {{ t('papers.create_offline_test_with_text') }}
          </VaButton> -->
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
