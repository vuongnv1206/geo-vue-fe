import { Delta } from '@vueup/vue-quill'
import DOMPurify from 'dompurify'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { ref } from 'vue'

// Định nghĩa kiểu cho nội dung Quill
type QuillContent = string | Delta

// Hàm chính để xử lý nội dung từ Quill
export const processQuillContent = (content: QuillContent): string => {
  // Chuyển đổi nội dung thành HTML nếu nó là Delta
  const htmlContent = convertToHtml(content)

  // Xử lý và làm sạch HTML
  const processedHtml = processHtml(htmlContent)

  // Sanitize HTML cuối cùng
  return sanitizeHtml(processedHtml)
}

// Hàm chuyển đổi Delta thành HTML
const convertToHtml = (content: QuillContent): string => {
  if (typeof content === 'object') {
    const converter = new QuillDeltaToHtmlConverter(content.ops, {})
    return converter.convert()
  }
  return content
}

// Hàm xử lý HTML
const processHtml = (html: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Xử lý ảnh
  doc.querySelectorAll('img').forEach(processImage)

  // Thay thế thẻ <b> bằng <strong>
  doc.querySelectorAll('b').forEach(replaceWithStrong)

  return doc.body.innerHTML
}

// Hàm xử lý ảnh
const processImage = (img: HTMLImageElement): void => {
  img.classList.add('user-content-image')
  img.style.maxWidth = '100%'
  img.style.height = 'auto'
}

// Hàm thay thế <b> bằng <strong>
const replaceWithStrong = (element: HTMLElement): void => {
  const strong = document.createElement('strong')
  strong.innerHTML = element.innerHTML
  element.parentNode?.replaceChild(strong, element)
}

// Hàm sanitize HTML
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'li', 'ol', 'ul', 'img', 'a'],
    ALLOWED_ATTR: ['src', 'alt', 'href', 'target', 'class', 'style'],
  })
}

// Sử dụng trong component Vue
export const useQuillReply = (emit: any) => {
  const replyContent = ref<QuillContent>('')

  const submitReply = (postId: string, parentId: string) => {
    if (replyContent.value) {
      const processedContent = processQuillContent(replyContent.value)
      emit('submit', postId, parentId, processedContent)
      replyContent.value = ''
    }
  }

  return {
    replyContent,
    submitReply,
  }
}
