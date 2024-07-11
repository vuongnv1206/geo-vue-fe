<template>
  <div class="max-w-2xl min-h-[75vh]">
    <VaCard class="relative bg-white rounded-lg shadow-md mb-2">
      <QuillEditor ref="quillEditor" v-model:content="newPost.content" class="pb-5" content-type="html" />
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
              <GeoAvatar
                class="mr-2"
                :size="48"
                color="warning"
                :image="post.owner?.imageUrl || undefined"
                :txt="post.owner?.firstName?.charAt(0).toUpperCase()"
              />
              <div>
                <h2 class="text-md font-bold text-gray-800">{{ post.owner?.firstName }} {{ post.owner?.lastName }}</h2>
                <VaPopover class="mb-2" placement="right" color="#FFFFFF" :message="format.formatDate(post.createdOn)">
                  <p class="text-xs text-gray-600">{{ format.formatDateFromNow(post.createdOn) }}</p>
                </VaPopover>
              </div>
            </div>
            <VaMenu
              :options="[
                { text: 'Edit', value: post, icon: 'edit' },
                { text: 'Delete', value: post, icon: 'delete' },
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
              <VaButton class="mr-4" preset="plain" icon="comment" @click="toggleComments(post.id)"
                >{{ post.comments.length }}
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
                      <GeoAvatar
                        class="mr-2"
                        :size="36"
                        color="warning"
                        :image="comment.owner?.imageUrl || undefined"
                        :txt="comment.owner?.firstName?.charAt(0).toUpperCase()"
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
                        { text: 'Edit', value: comment, icon: 'edit' },
                        { text: 'Delete', value: comment, icon: 'delete' },
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
                    <VaButton preset="plain" size="small" icon="reply" @click="toggleReplies(comment.id)">
                      Reply</VaButton
                    >
                  </div>
                  <div v-if="selectedCommentIds.includes(comment.id)">
                    <Comments
                      :post-id="post.id"
                      :parent-id="comment.id"
                      @save="(comment: EmptyComment) => OnCommentSaved(comment)"
                    />
                  </div>
                </div>
              </template>
            </VaTreeView>
            <Comments
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
        <VaCardContent class="text-center">There is no news!!</VaCardContent>
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
    <VaModalHeader>
      <h3 class="text-lg font-bold">Edit Post</h3>
    </VaModalHeader>
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
    <VaModalHeader>
      <h3 class="text-lg font-bold">Edit Comment</h3>
    </VaModalHeader>
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
import { format, getErrorMessage, notifications } from '@/services/utils'
import { onMounted, ref } from 'vue'
import Comments from './Comments.vue'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useModal, useToast, VaCard, VaCardContent, VaDivider, VaIcon, VaModal } from 'vuestic-ui'
import { Comment, EmptyComment, EmptyCommentLike, EmptyPost, EmptyPostLike, Post } from '../types'
import { usePostsStore } from '@/stores/modules/posts.module'
import { useCommentStore } from '@/stores/modules/comments.module'
import { Quill, QuillEditor } from '@vueup/vue-quill'
import EditComment from './EditComment.vue'
import EditPosts from './EditPosts.vue'
import GeoAvatar from '@/components/avatar/GeoAvatar.vue'

const loading = ref(true)
const { init: notify } = useToast()
const { confirm } = useModal()

const authStore = useAuthStore()
const postsStore = usePostsStore()
const commentStore = useCommentStore()

const editFormRef = ref()

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

const newPost = ref({ ...defaultNewPost })

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 10,
  orderBy: ['id'],
})

const getPosts = () => {
  loading.value = true
  postsStore
    .getPosts(dataFilter.value)
    .then((response) => {
      posts.value = response.data.filter((post) => post.classesId === props.classId)
      // console.log('Postsssssssssssssssssssssss:', posts.value)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('posts') + getErrorMessage(error),
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
  if (option.text === 'Edit') {
    doShowPostFormModal.value = true
    postToEdit.value = option.value
  } else {
    deletePosts(option.value.id)
  }
}

const OnPostsSaved = async (post: EmptyPost) => {
  console.log('post content:', post.content)
  if (post.content != null && post.content.trim() !== '' && post.content !== '<p><br></p>') {
    if (post.id != '') {
      doShowPostFormModal.value = false
      postsStore
        .updatePost(post.id, post as EmptyPost)
        .then(() => {
          notify({
            message: notifications.updatedSuccessfully('post'),
            color: 'success',
          })
          getPosts()
        })
        .catch((error) => {
          notify({
            message: notifications.updateFailed('post') + getErrorMessage(error),
            color: 'error',
          })
        })
    } else {
      postsStore
        .createPost(post as EmptyPost)
        .then(() => {
          notify({
            message: notifications.createSuccessfully('post'),
            color: 'success',
          })
          if (quillInstance.value) {
            quillInstance.value.setText('')
          }
          getPosts()
        })
        .catch((error) => {
          notify({
            message: notifications.createFailed('post') + getErrorMessage(error),
            color: 'error',
          })
        })
    }
  } else {
    notify({
      message: 'Please enter content',
      color: 'error',
    })
  }
}

const deletePosts = (postId: string) => {
  confirm({
    title: 'Delete Post',
    message: notifications.confirmDelete('post'),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    postsStore
      .deletePost(postId)
      .then(() => {
        notify({
          message: notifications.deleteSuccessfully('post'),
          color: 'success',
        })
        getPosts()
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed('post') + getErrorMessage(error),
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
  console.log('option value:', option.value)
  if (option.text === 'Edit') {
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
            message: notifications.updatedSuccessfully('comment'),
            color: 'success',
          })
          getPosts()
        })
        .catch((error) => {
          notify({
            message: notifications.updateFailed('comment') + getErrorMessage(error),
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
            message: notifications.createSuccessfully('comment'),
            color: 'success',
          })
          getPosts()
        })
        .catch((error) => {
          notify({
            message: notifications.createFailed('comment') + getErrorMessage(error),
            color: 'error',
          })
        })
    }
  } else {
    notify({
      message: 'Please enter content',
      color: 'error',
    })
  }
}

const deleteComment = (commentId: string) => {
  confirm({
    title: 'Delete Comment',
    message: notifications.confirmDelete('comment'),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    commentStore
      .deleteComment(commentId)
      .then(() => {
        notify({
          message: notifications.deleteSuccessfully('comment'),
          color: 'success',
        })
        getPosts()
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed('comment') + getErrorMessage(error),
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
        message: notifications.updateFailed('post') + getErrorMessage(error),
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
        message: notifications.updateFailed('post') + getErrorMessage(error),
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
        message: notifications.updateFailed('comment') + getErrorMessage(error),
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
        message: notifications.updateFailed('comment') + getErrorMessage(error),
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
