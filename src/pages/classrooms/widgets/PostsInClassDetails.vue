<template>
  <div class="max-w-2xl min-h-[75vh]">
    <VaCard class="relative bg-white rounded-lg shadow-md mb-2">
      <QuillEditor
        ref="quillEditor"
        v-model:content="newPost.content"
        class="pb-5"
        :placeholder="$t('posts.enter_content')"
        content-type="html"
      />
      <VaCard class="absolute bottom-2 right-2">
        <VaButton
          class="mr-2"
          preset="plain"
          :icon="newPost.isLockComment ? 'lock' : 'lock_open'"
          @click="newPost.isLockComment = !newPost.isLockComment"
        />
        <VaButton preset="plain" icon="send" class="mr-2" @click="OnPostsSaved(newPost)" />
      </VaCard>
    </VaCard>
    <div v-if="posts.length > 0">
      <div
        v-for="post in posts"
        :key="post.id"
        :postId="post.id"
        class="bg-white rounded-lg shadow-md overflow-hidden mb-6"
      >
        <VaCard class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center mb-4">
              <!-- <GeoAvatar
                class="mr-2"
                :size="48"
                color="warning"
                :image="post.owner?.imageUrl || undefined"
                :txt="post.owner?.firstName?.charAt(0).toUpperCase()"
              /> -->
              <VaAvatar
                :src="getSrcAvatar(post.owner?.imageUrl)"
                class="w-14 h-14 font-bold mr-2"
                :fallback-text="post.owner?.firstName?.charAt(0)?.toUpperCase()"
                :color="avatarColor(post.owner?.firstName)"
              />
              <div>
                <h2 class="text-md font-bold text-gray-800">{{ post.owner?.firstName }} {{ post.owner?.lastName }}</h2>
                <VaPopover class="mb-2" placement="right" color="#FFFFFF" :message="format.formatDate(post.createdOn)">
                  <p class="text-xs text-gray-600">{{ format.formatDateFromNow(post.createdOn) }}</p>
                </VaPopover>
              </div>
            </div>
            <VaMenu
              v-if="currentUser == post.owner?.id"
              :options="[
                { text: t('settings.edit'), value: post, icon: 'edit' },
                { text: t('settings.delete'), value: post, icon: 'delete' },
              ]"
              @selected="(v: any) => selectedPostOption(v)"
            >
              <template #anchor>
                <VaCard class="cursor-pointer text-gray-500 hover:text-gray-700" @click.stop>
                  <span class="material-symbols-outlined">more_horiz</span>
                </VaCard>
              </template>
            </VaMenu>
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <div class="text-base text-gray-700 mb-4" v-html="post.content" />
          <!--eslint-enable-->
          <VaDivider />
          <div class="flex items-center justify-start">
            <VaCard class="mr-auto">
              <VaButton
                v-model="isLikePost"
                preset="plain"
                icon="favorite"
                class="mr-4"
                color="danger"
                @click="togglePostLike(post)"
                >{{ post.numberLikeInThePost }}
              </VaButton>
              <VaButton class="mr-4" preset="plain" icon="comment" @click="toggleComments(post.id)">
                {{ post.comments.length }}
              </VaButton>
            </VaCard>
          </div>
          <div v-if="selectedPostIds.includes(post.id)">
            <VaDivider />
            <VaTreeView :nodes="structureComments(post.comments)" children-by="comments">
              <template #content="comment">
                <div class="bg-white p-3 rounded-md shadow-sm mb-2" :commentId="comment.id">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center mb-2">
                      <!-- <GeoAvatar
                        class="mr-2"
                        :size="36"
                        color="warning"
                        :image="comment.owner?.imageUrl || undefined"
                        :txt="comment.owner?.firstName?.charAt(0).toUpperCase()"
                      /> -->
                      <VaAvatar
                        :src="getSrcAvatar(comment.owner?.imageUrl)"
                        class="w-14 h-14 font-bold mr-2"
                        :fallback-text="comment.owner?.firstName?.charAt(0)?.toUpperCase()"
                        :color="avatarColor(comment.owner?.firstName)"
                      />
                      <div class="flex flex-col">
                        <h2 class="text-sm font-bold text-gray-800">
                          {{ comment.owner?.firstName }} {{ comment.owner?.lastName }}
                        </h2>
                        <VaPopover
                          class="mb-2"
                          placement="right"
                          color="#FFFFFF"
                          :message="format.formatDate(comment.createdOn)"
                        >
                          <p class="text-xs text-gray-600">{{ format.formatDateFromNow(comment.createdOn) }}</p>
                        </VaPopover>
                      </div>
                    </div>
                    <VaMenu
                      :options="[
                        { text: t('settings.edit'), value: comment, icon: 'edit' },
                        { text: t('settings.delete'), value: comment, icon: 'delete' },
                      ]"
                      @selected="(v: any) => selectedCommentOption(v)"
                    >
                      <template #anchor>
                        <VaCard class="cursor-pointer text-gray-500 hover:text-gray-700" @click.stop>
                          <span class="material-symbols-outlined">more_horiz</span>
                        </VaCard>
                      </template>
                    </VaMenu>
                  </div>
                  <!-- eslint-disable vue/no-v-html -->
                  <div class="text-sm text-gray-700" v-html="comment.content" />
                  <!--eslint-enable-->
                  <div class="my-2 flex items-center justify-start">
                    <VaButton
                      v-model="isLikeComment"
                      class="mr-2"
                      preset="plain"
                      size="small"
                      icon="favorite"
                      color="danger"
                      @click="toggleCommentLike(comment)"
                    >
                      {{ comment.numberLikeInComment }}
                    </VaButton>

                    <VaButton
                      :disabled="post.isLockComment && isStudent"
                      preset="plain"
                      size="small"
                      icon="reply"
                      @click="toggleReplies(comment.id)"
                    >
                      {{ t('comments.reply') }}</VaButton
                    >
                  </div>
                  <div v-if="selectedCommentIds.includes(comment.id)">
                    <Comments
                      v-if="!post.isLockComment || !isStudent"
                      :post-id="post.id"
                      :parent-id="comment.id"
                      @save="(comment: EmptyComment) => OnCommentSaved(comment)"
                    />
                  </div>
                </div>
              </template>
            </VaTreeView>
            <Comments
              v-if="!post.isLockComment || !isStudent"
              :post-id="post.id"
              :parent-id="commentId"
              @save="(comment: EmptyComment) => OnCommentSaved(comment)"
            />
          </div>
        </VaCard>
      </div>
    </div>
    <div v-else>
      <VaCard class="bg-white rounded-lg shadow-md p-6">
        <VaIcon class="flex justify-center" name="newspaper" size="4rem" />
        <VaCardContent class="text-center">{{ t('posts.no_post') }}</VaCardContent>
      </VaCard>
    </div>
  </div>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowPostFormModal"
    size="small"
    stateful
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowPostFormModal = false"
  >
    <h3 class="text-lg font-bold">{{ t('posts.edit_post') }}</h3>
    <EditPosts
      ref="editFormRef"
      :posts="postToEdit"
      @close="cancel"
      @save="
        (posts: EmptyPost) => {
          OnPostsSaved(posts)
          ok()
        }
      "
    />
  </VaModal>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowCommentFormModal"
    size="small"
    stateful
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowCommentFormModal = false"
  >
    <h3 class="text-lg font-bold">{{ t('comments.edit_comment') }}</h3>
    <EditComment
      ref="editFormRef"
      :comment="commentToEdit"
      :post-id="postId"
      :parent-id="commentId"
      @close="cancel"
      @save="
        (comment: EmptyComment) => {
          OnCommentSaved(comment)
          ok()
        }
      "
    />
  </VaModal>
</template>

<script setup lang="ts">
import { avatarColor, format, getErrorMessage, notifications } from '@/services/utils'
import { computed, onMounted, ref } from 'vue'
import { useModal, useToast, VaModal } from 'vuestic-ui'
import EditPosts from './EditPosts.vue'
import EditComment from './EditComment.vue'
import Comments from './Comments.vue'
import { Comment, EmptyComment, EmptyCommentLike, EmptyPost, EmptyPostLike, Post } from '../types'
import { useAuthStore } from '@/stores/modules/auth.module'
import { usePostsStore } from '@/stores/modules/posts.module'
import { useCommentStore } from '@/stores/modules/comments.module'
import { Quill, QuillEditor } from '@vueup/vue-quill'
import { useI18n } from 'vue-i18n'
import { getSrcAvatar } from '@/pages/audit-logs/helper'

const { t } = useI18n()
const loading = ref(true)
const { init: notify } = useToast()
const { confirm } = useModal()

const authStore = useAuthStore()
const postsStore = usePostsStore()
const commentStore = useCommentStore()

const editFormRef = ref()
// const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))
const isStudent = computed(() => authStore?.musHaveRole('Student'))
const postId = ref<string | null>(null)
const commentId = ref<string>('')
const userId = authStore.user?.id ?? ''

const posts = ref<Post[]>([])
const commentToEdit = ref<EmptyComment | null>(null)
const postToEdit = ref<EmptyPost | null>(null)

const doShowCommentFormModal = ref(false)
const doShowPostFormModal = ref(false)

const isLikePost = ref(false)
const isLikeComment = ref(false)
const selectedPostIds = ref<string[]>([])
const selectedCommentIds = ref<string[]>([])

const quillEditor = ref<InstanceType<typeof QuillEditor> | null>(null)
const quillInstance = ref<Quill | null>(null)

const props = defineProps<{
  classId: string
}>()

const defaultNewPost: EmptyPost = {
  id: '',
  classesId: props.classId,
  content: '',
  isLockComment: false,
}

const currentUser = authStore.user?.id

const newPost = ref({ ...defaultNewPost })

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 10,
  orderBy: ['id'],
  classId: props.classId,
})

const getPosts = () => {
  loading.value = true
  postsStore
    .getPosts(dataFilter.value)
    .then((response) => {
      posts.value = response.data
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('posts.posts')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const structureComments = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<string, Comment>()
  const rootComments: Comment[] = []

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, comments: [] })
  })

  commentMap.forEach((comment) => {
    if (comment.parentId === null) {
      rootComments.push(comment)
    } else {
      const parentComment = commentMap.get(comment.parentId)
      if (parentComment) {
        parentComment.comments!.push(comment)
      }
    }
  })

  return rootComments
}

const selectedPostOption = (option: any) => {
  if (option.text === t('settings.edit')) {
    doShowPostFormModal.value = true
    postToEdit.value = option.value
  } else {
    deletePosts(option.value.id)
  }
}

const OnPostsSaved = async (post: EmptyPost) => {
  if (post.content != null && post.content.trim() !== '' && post.content !== '<p><br></p>') {
    if (post.id != '') {
      doShowPostFormModal.value = false
      postsStore
        .updatePost(post.id, post as EmptyPost)
        .then(() => {
          notify({
            message: notifications.updatedSuccessfully(t('posts.posts')),
            color: 'success',
          })
          getPosts()
        })
        .catch((error) => {
          notify({
            message: notifications.updateFailed(t('posts.posts')) + getErrorMessage(error),
            color: 'error',
          })
        })
    } else {
      postsStore
        .createPost(post as EmptyPost)
        .then(() => {
          notify({
            message: notifications.createSuccessfully(t('posts.posts')),
            color: 'success',
          })
          if (quillInstance.value) {
            quillInstance.value.setText('')
          }
          getPosts()
        })
        .catch((error) => {
          notify({
            message: notifications.createFailed(t('posts.posts')) + getErrorMessage(error),
            color: 'error',
          })
        })
    }
  } else {
    notify({
      message: t('posts.please_enter_content'),
      color: 'error',
    })
  }
}

const deletePosts = (postId: string) => {
  confirm({
    title: t('posts.delete_post'),
    message: notifications.confirmDelete(t('posts.posts')),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    postsStore
      .deletePost(postId)
      .then(() => {
        notify({
          message: notifications.deleteSuccessfully(t('posts.posts')),
          color: 'success',
        })
        getPosts()
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed(t('posts.posts')) + getErrorMessage(error),
          color: 'error',
        })
      })
  })
}

const toggleComments = (postId: string) => {
  const index = selectedPostIds.value.indexOf(postId)
  if (index === -1) {
    selectedPostIds.value.push(postId)
  } else {
    selectedPostIds.value.splice(index, 1)
  }
}

const toggleReplies = (commentId: string) => {
  const index = selectedCommentIds.value.indexOf(commentId)
  if (index === -1) {
    selectedCommentIds.value.push(commentId)
  } else {
    selectedCommentIds.value.splice(index, 1)
  }
}

const selectedCommentOption = (option: any) => {
  if (option.text === t('settings.edit')) {
    doShowCommentFormModal.value = true
    commentToEdit.value = option.value
  } else {
    deleteComment(option.value.id)
  }
}

const OnCommentSaved = async (comment: EmptyComment) => {
  doShowCommentFormModal.value = false
  if (comment.content != null && comment.content.trim() !== '' && comment.content !== '<p><br></p>') {
    if (comment.id != '') {
      commentStore
        .updateComment(comment.id, comment as EmptyComment)
        .then(() => {
          notify({
            message: notifications.updatedSuccessfully(t('comments.comment')),
            color: 'success',
          })
          getPosts()
        })
        .catch((error) => {
          notify({
            message: notifications.updateFailed(t('comments.comment')) + getErrorMessage(error),
            color: 'error',
          })
        })
    } else {
      let comm
      if (comment.parentId === '') {
        comm = { postId: comment.postId, content: comment.content }
      } else {
        comm = comment
      }
      commentStore
        .createComment(comm)
        .then(() => {
          notify({
            message: notifications.createSuccessfully(t('comments.comment')),
            color: 'success',
          })
          getPosts()
        })
        .catch((error) => {
          notify({
            message: notifications.createFailed(t('comments.comment')) + getErrorMessage(error),
            color: 'error',
          })
        })
    }
  } else {
    notify({
      message: t('comments.please_enter_content'),
      color: 'error',
    })
  }
}

const deleteComment = (commentId: string) => {
  confirm({
    title: t('comments.delete_comment'),
    message: notifications.confirmDelete(t('comments.comment')),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    commentStore
      .deleteComment(commentId)
      .then(() => {
        notify({
          message: notifications.deleteSuccessfully(t('comments.comment')),
          color: 'success',
        })
        getPosts()
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed(t('comments.comment')) + getErrorMessage(error),
          color: 'error',
        })
      })
  })
}

const togglePostLike = (post: Post) => {
  isLikePost.value = !isLikePost.value
  if (isLikePost.value) {
    likePosts({ userId, postsId: post.id })
  } else {
    dislikePosts({ userId, postsId: post.id })
  }
}

const likePosts = (postLike: EmptyPostLike) => {
  postsStore
    .likePost(postLike)
    .then(() => {
      getPosts()
    })
    .catch((error) => {
      notify({
        message: notifications.updateFailed(t('posts.posts')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

const dislikePosts = (postDisLike: EmptyPostLike) => {
  postsStore
    .dislikePost(postDisLike)
    .then(() => {
      getPosts()
    })
    .catch((error) => {
      notify({
        message: notifications.updateFailed(t('posts.posts')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

const toggleCommentLike = (comment: Comment) => {
  isLikeComment.value = !isLikeComment.value
  if (isLikeComment.value) {
    likeComment({ userId, commentId: comment.id })
  } else {
    dislikeComment({ userId, commentId: comment.id })
  }
}

const likeComment = (commentLike: EmptyCommentLike) => {
  commentStore
    .likeComment(commentLike)
    .then(() => {
      getPosts()
    })
    .catch((error) => {
      notify({
        message: notifications.updateFailed(t('comments.comment')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

const dislikeComment = (commentDisLike: EmptyCommentLike) => {
  commentStore
    .dislikeComment(commentDisLike)
    .then(() => {
      getPosts()
    })
    .catch((error) => {
      notify({
        message: notifications.updateFailed(t('comments.comment')) + getErrorMessage(error),
        color: 'error',
      })
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
  if (quillEditor.value) {
    quillInstance.value = quillEditor.value.getQuill()
  }
  getPosts()
})
</script>
