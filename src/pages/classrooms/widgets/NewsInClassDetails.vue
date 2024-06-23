<script lang="ts" setup>
import { ref } from 'vue'
// @ts-expect-error Richer is not defined
import Richer from 'richer-than-rich'
import 'richer-than-rich/dist/style.css'

interface Comment {
  author: string
  avatar: string
  content: string
}

interface News {
  id: number
  title: string
  content: string
  author: string
  avatar: string
  likes: number
  comments: Comment[]
  showCommentInput: boolean
}

const activeElement = ref('News')
const listNews = ref<News[]>([])
const loading = ref(true)
const newPostContent = ref('')
const newCommentContent = ref('')

// Simulate fetching news
setTimeout(() => {
  listNews.value = [
    {
      id: 1,
      title: 'News 1',
      content: 'Content of news 1',
      author: 'Author 1',
      avatar: 'avatar1.png',
      likes: 0,
      comments: [],
      showCommentInput: false,
    },
    {
      id: 2,
      title: 'News 2',
      content: 'Content of news 2',
      author: 'Author 2',
      avatar: 'avatar2.png',
      likes: 0,
      comments: [],
      showCommentInput: false,
    },
    // Add more news items here
  ]
  loading.value = false
}, 2000)

// Function to add a new post
const addNewPost = () => {
  if (newPostContent.value.trim() !== '') {
    listNews.value.unshift({
      id: Date.now(),
      title: `News ${listNews.value.length + 1}`,
      content: newPostContent.value,
      author: 'Current User',
      avatar: 'current_user_avatar.png',
      likes: 0,
      comments: [],
      showCommentInput: false,
    })
    newPostContent.value = ''
  }
}

// Function to add a like
const addLike = (newsId: number) => {
  const newsItem = listNews.value.find((news) => news.id === newsId)
  if (newsItem) {
    newsItem.likes++
  }
}

// Function to toggle comment input visibility
const toggleCommentInput = (newsId: number) => {
  const newsItem = listNews.value.find((news) => news.id === newsId)
  if (newsItem) {
    newsItem.showCommentInput = !newsItem.showCommentInput
  }
}

// Function to add a comment
const addComment = (newsId: number, commentContent: string) => {
  const newsItem = listNews.value.find((news) => news.id === newsId)
  if (newsItem && commentContent.trim() !== '') {
    newsItem.comments.push({
      author: 'Current User',
      avatar: 'current_user_avatar.png',
      content: commentContent,
    })
    newsItem.showCommentInput = false
    newCommentContent.value = ''
  }
}
</script>

<template>
  <Richer> </Richer>

  <div class="main-container">
    <div class="content-container">
      <div v-if="activeElement === 'News'">
        <div class="new-post">
          <div class="post-content">
            <textarea v-model="newPostContent" placeholder="Write your news..."></textarea>
            <div class="post-actions">
              <VaIcon name="lock" class="post-icon" style="font-size: 30px" />
              <VaButton @click="addNewPost">Post</VaButton>
            </div>
          </div>
        </div>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else class="news-list">
          <div v-for="news in listNews" :key="news.id" class="news-item">
            <div class="author-info">
              <img :src="news.avatar" alt="Avatar" class="avatar" />
              <p class="author">{{ news.author }}</p>
            </div>
            <h4>{{ news.content }}</h4>

            <div class="actions">
              <button @click="addLike(news.id)">
                <VaIcon name="favorite" />
                {{ news.likes }}
              </button>
              <button @click="toggleCommentInput(news.id)">
                <VaIcon name="chat_bubble" />
              </button>
            </div>
            <div class="comments">
              <div v-for="comment in news.comments" :key="comment.content" class="comment">
                <img :src="comment.avatar" alt="Avatar" class="avatar" />
                <div class="comment-body">
                  <p class="comment-author">{{ comment.author }}</p>
                  <p class="comment-content">{{ comment.content }}</p>
                </div>
              </div>
              <div v-if="news.showCommentInput">
                <VaTextarea
                  v-model="newCommentContent"
                  placeholder="Add a comment..."
                  @keyup.enter="addComment(news.id, newCommentContent)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar-container {
  width: 250px;
  flex-shrink: 0;
}

.sidebar {
  background-color: #ffffff;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-item {
  border-radius: 8px;
  transition: background-color 0.3s;
}

.sidebar-item:hover {
  background-color: #f1f1f1;
}

.sidebar-item[aria-selected='true'] {
  background-color: #007bff;
  color: white;
}

.sidebar-item[aria-selected='true'] .va-icon,
.sidebar-item[aria-selected='true'] .va-sidebar-item-title {
  color: white;
}

.content-container {
  flex: 1;
  overflow-y: auto;
}

.new-post {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-post textarea {
  width: 100%;
  padding: 8px;
  border: none;
  resize: none;
  outline: none;
  border-radius: 4px;
  margin-bottom: 8px;
  min-height: 100px;
  /* Optional: Adjust the height as needed */
}

.new-post .post-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-bottom: 8px;
  /* Adjust as needed */
  padding-right: 8px;
  /* Adjust as needed */
}

.new-post .post-icon {
  cursor: pointer;
}

.new-post button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.new-post button:hover {
  background-color: #0056b3;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-item {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.news-item .author-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.news-item .author-info .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
}

.news-item .author {
  font-size: 14px;
  color: #999;
}

.news-item .actions {
  margin-top: 8px;
}

.news-item .actions button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
}

.news-item .actions button:hover {
  text-decoration: underline;
}

.comments {
  margin-top: 16px;
}

.comments .comment {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 8px;
}

.comments .comment .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.comments .comment .comment-body {
  display: flex;
  flex-direction: column;
}

.comments .comment .comment-author {
  font-weight: bold;
  margin-bottom: 4px;
}

.comments .comment .comment-content {
  flex: 1;
}

.comments input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
