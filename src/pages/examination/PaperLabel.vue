<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useModal, useToast, VaPagination, VaSelect } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useI18n } from 'vue-i18n'
import { CreatePaperLabelRequest, PaperLabelDto } from './types'
import { usePaperLabelStore } from '@/stores/modules/paperLabel.module'
import LabelTable from '@/pages/examination/widgets/labels/LabelTable.vue'
import UpdateLabelForm from '@/pages/examination/widgets/labels/UpdateLabelForm.vue'
const { t } = useI18n()

const loading = ref(true)
const stores = usePaperLabelStore()
const labels = ref<PaperLabelDto[]>([])
const selectedItemsEmitted = ref<PaperLabelDto[]>([])
const labelToEdit = ref<PaperLabelDto | null>(null)
const doShowLabelFormModal = ref(false)
const { init: notify } = useToast()
const editFormRef = ref()
const { confirm } = useModal()

const dataFilter = ref({
  advancedSearch: {
    fields: ['name'],
    keyword: '',
  },
  pageNumber: 1,
  totalPages: 1,
  totalCount: 1,
  pageSize: 10,
  orderBy: ['createdOn'],
})

const searchLabels = (filter: typeof dataFilter.value) => {
  loading.value = true
  stores
    .searchPaperLabels(filter)
    .then((response) => {
      labels.value = response.data
      dataFilter.value = {
        ...dataFilter.value,
        pageNumber: response.currentPage,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
        pageSize: response.pageSize,
      }
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('Failed to get labels')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const handlePageChange = (newPage: number) => {
  dataFilter.value.pageNumber = newPage
  searchLabels(dataFilter.value)
}

const handlePageSizeChange = (newPageSize: number) => {
  dataFilter.value.pageNumber = 1
  dataFilter.value.pageSize = newPageSize
  searchLabels(dataFilter.value)
}

const startItemIndex = computed(() => {
  return (dataFilter.value.pageNumber - 1) * dataFilter.value.pageSize + 1
})

const endItemIndex = computed(() => {
  return Math.min(dataFilter.value.pageNumber * dataFilter.value.pageSize, dataFilter.value.totalCount)
})

const createNewLabel = () => {
  labelToEdit.value = null
  doShowLabelFormModal.value = true
}

const editLabel = (label: PaperLabelDto) => {
  labelToEdit.value = label
  doShowLabelFormModal.value = true
}

const onLabelSaved = async (label: PaperLabelDto) => {
  doShowLabelFormModal.value = false
  if (label.id) {
    stores
      .updatePaperLabel(label, label.id)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(label.name),
          color: 'success',
        })
        searchLabels(dataFilter.value)
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed(label.name) + getErrorMessage(error),
          color: 'error',
        })
      })
  } else {
    stores
      .createPaperLabel(label as CreatePaperLabelRequest)
      .then(() => {
        notify({
          message: notifications.createSuccessfully(label.name),
          color: 'success',
        })
        searchLabels(dataFilter.value)
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed(label.name) + getErrorMessage(error),
          color: 'error',
        })
      })
  }
}

const deleteLabel = (label: PaperLabelDto) => {
  stores
    .deletePaperLabel(label.id)
    .then(() => {
      notify({
        message: notifications.deleteSuccessfully(label.name),
        color: 'success',
      })
      searchLabels(dataFilter.value)
    })
    .catch((error) => {
      notify({
        message: notifications.deleteFailed(label.name) + getErrorMessage(error),
        color: 'error',
      })
    })
}

const deleteSelectedLabel = () => {
  confirm({
    title: 'Delete Label',
    message: notifications.confirmDelete(
      `${selectedItemsEmitted.value.length} ` + 'Are you sure you want to delete "${paper.examName}"?',
    ),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    selectedItemsEmitted.value.forEach((label) => {
      deleteLabel(label)
    })
  })
}

const deleteLabelWithConfirm = (label: PaperLabelDto) => {
  confirm({
    title: t('Delete Label'),
    message: notifications.confirmDelete(label.name),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    deleteLabel(label)
  })
}

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: notifications.unsavedChanges,
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

onMounted(() => {
  searchLabels(dataFilter.value)
})
</script>

<template>
  <VaCard>
    <VaCardContent class="min-h-[85vh]">
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton v-if="selectedItemsEmitted.length != 0" icon="delete" color="danger" @click="deleteSelectedLabel()">
          {{ $t('settings.delete') }}
        </VaButton>
        <VaButton icon="add" @click="createNewLabel()">New Label</VaButton>
      </div>
      <VaScrollContainer class="max-h-[72vh]" vertical>
        <LabelTable
          v-model:selectedItemsEmitted="selectedItemsEmitted"
          :loading="loading"
          :labels="labels"
          @edit="editLabel"
          @delete="deleteLabelWithConfirm"
        />
      </VaScrollContainer>
      <div v-if="dataFilter.totalCount > 0" class="flex flex-row justify-between items-center mt-4">
        <p>{{ $t('subjects.range', { start: startItemIndex, end: endItemIndex, total: dataFilter.totalCount }) }}</p>
        <VaPagination
          v-model="dataFilter.pageNumber"
          gapped
          :visible-pages="3"
          buttons-preset="secondary"
          :pages="dataFilter.totalPages"
          @update:modelValue="handlePageChange"
        />
        <VaSelect
          v-model="dataFilter.pageSize"
          class="w-32"
          :options="[10, 25, 50, 100, 250]"
          @update:modelValue="handlePageSizeChange"
        />
      </div>
    </VaCardContent>
  </VaCard>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowLabelFormModal"
    size="small"
    stateful
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowLabelFormModal = false"
  >
    <VaModalHeader>
      <h3 class="text-lg font-bold">{{ labelToEdit ? $t('settings.edit') : $t('settings.create') }} {{ 'Label' }}</h3>
    </VaModalHeader>
    <UpdateLabelForm
      ref="editFormRef"
      :label="labelToEdit"
      :save-button-label="labelToEdit === null ? $t('settings.add') : $t('settings.save')"
      @close="cancel"
      @save="
        (label: PaperLabelDto) => {
          onLabelSaved(label)
          ok()
        }
      "
    />
  </VaModal>
</template>
