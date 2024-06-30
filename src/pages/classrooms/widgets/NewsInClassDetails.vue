<template>
  <div class="max-w-2xl">
    <VaCard class="relative bg-white rounded-lg shadow-md mb-2">
      <QuillEditor v-model:content="newPostContent" class="pb-5" />
      <VaCard class="absolute bottom-2 right-2">
        <VaButton class="mr-2" preset="plain" :icon="postId ? 'lock' : 'lock_open'" />
        <VaButton preset="plain" icon="send" class="mr-2" />
      </VaCard>
    </VaCard>
    <div
      v-for="post in posts"
      :key="post.id"
      :postId="post.id"
      class="bg-white rounded-lg shadow-md overflow-hidden mb-6"
    >
      <VaCard class="p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center mb-4">
            <VaAvatar :src="post.user.avatar" class="mr-4" />
            <div>
              <h2 class="text-md font-bold text-gray-800">{{ post.user.firstName }} {{ post.user.lastName }}</h2>
              <VaPopover
                class="mb-2"
                placement="right"
                color="#FFFFFF"
                :message="format.formatDate(new Date(post.createdAt))"
              >
                <p class="text-xs text-gray-600">{{ format.formatDateFromNow(new Date(post.createdAt)) }}</p>
              </VaPopover>
            </div>
          </div>
          <VaMenu
            :options="[
              { text: 'Edit', value: post.id, icon: 'edit' },
              { text: 'Delete', value: post.id, icon: 'delete' },
            ]"
          >
            <template #anchor>
              <VaCard class="cursor-pointer text-gray-500 hover:text-gray-700" @click.stop>
                <span class="material-symbols-outlined">more_horiz</span>
              </VaCard>
            </template>
          </VaMenu>
        </div>
        <div class="text-base text-gray-700 mb-4" v-html="post.content" />
        <VaDivider />
        <div class="flex items-center justify-between">
          <VaCard class="mr-auto">
            <VaButton preset="plain" icon="favorite" class="mr-4" color="danger" @click="likePost(post)">
              {{ post.numberLikeInTheNews }}
            </VaButton>
            <VaButton preset="plain" icon="comment" @click="toggleComments(post)" />
          </VaCard>
          <VaCard>
            <span class="font-bold"> {{ post.comments.length }} Comment </span>
          </VaCard>
        </div>
        <div v-if="post.showComments">
          <VaDivider />
          <VaTreeView :nodes="structureComments(post.comments)" children-by="comments">
            <template #content="comment">
              <div class="bg-white p-3 rounded-md shadow-sm mb-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center mb-2">
                    <VaAvatar :src="comment.user.avatar" class="mr-2" />
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold">{{ comment.user.name }}</span>
                      <VaPopover
                        class="mb-2"
                        placement="right"
                        color="#FFFFFF"
                        :message="format.formatDate(new Date(comment.createdAt))"
                      >
                        <p class="text-xs text-gray-600">{{ format.formatDateFromNow(new Date(comment.createdAt)) }}</p>
                      </VaPopover>
                    </div>
                  </div>
                  <VaMenu
                    :options="[
                      { text: 'Edit', value: post.id, icon: 'edit' },
                      { text: 'Delete', value: post.id, icon: 'delete' },
                    ]"
                  >
                    <template #anchor>
                      <VaCard class="cursor-pointer text-gray-500 hover:text-gray-700" @click.stop>
                        <span class="material-symbols-outlined">more_horiz</span>
                      </VaCard>
                    </template>
                  </VaMenu>
                </div>

                <div class="text-sm text-gray-700" v-html="comment.content" />
                <div class="my-2 flex items-center justify-start">
                  <VaButton preset="plain" size="small" icon="favorite" color="danger" class="mr-2">
                    {{ comment.numberLikeInTheComment }}
                  </VaButton>
                  <VaButton preset="plain" size="small" icon="reply" @click="startReply(comment)">Reply</VaButton>
                </div>
                <CommentInNews
                  v-if="replyingTo === comment.id"
                  :post-id="post.id"
                  :parent-id="comment.id"
                  @submit="submitReply"
                  @cancel="cancelReply"
                />
              </div>
            </template>
          </VaTreeView>
        </div>
      </VaCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from '@/services/utils'
import { ref } from 'vue'
import CommentInNews from './CommentInNews.vue'
import { useAuthStore } from '@/stores/modules/auth.module'
import { VaCard, VaDivider } from 'vuestic-ui/web-components'
import { Comment, EmptyComment, Post } from '../types'

const posts = ref<Post[]>([])
const postId = ref<string | null>(null)
const replyingTo = ref<string | null>(null)

const authStore = useAuthStore()
const currentUserId = authStore.user?.id ?? ''
// const currentUserName = authStore.user?.fullName ?? ''
const newPostContent = ref('')

// const fetchPosts = async () => {
//   try {
//     const response = await axios.get('https://69b7b9cf-3f30-4450-8124-73d93e0db00a.mock.pstmn.io/news/search')
//     posts.value = response.data
//     // console.log('Post Value', posts.value)
//   } catch (error) {
//     console.error(error)
//   }
// }

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

const likePost = (post: Post) => {
  post.numberLikeInTheNews++
}

const toggleComments = (post: Post) => {
  post.showComments = !post.showComments
}

const startReply = (comment: Comment) => {
  replyingTo.value = comment.id
}

const cancelReply = () => {
  replyingTo.value = null
}

const submitReply = (postId: string, parentId: string, content: string) => {
  const post = posts.value.find((p) => p.id === postId)
  if (post) {
    const newComment: EmptyComment = {
      userId: currentUserId,
      postId: postId,
      content: content,
      parentId: parentId,
    }
    // post.comments.push(newComment)
    console.log('New Comment', newComment)
  }
  replyingTo.value = null
}
</script>
