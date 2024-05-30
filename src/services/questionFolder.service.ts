import apiService from '@services/api.service'
import { QuestionTreeEmpty, SharePermission } from '@/pages/question/types'

class QuestionFolderService {
  async getQuestionFolders(parentId: string): Promise<any> {
    return apiService
      .get(`/v1/questionfolder/?parentId=${parentId}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async createQuestionFolder(data: QuestionTreeEmpty): Promise<any> {
    const { id, name, parentId } = data
    const payload: { name: string; id?: string; parentId?: string } = { name }
    if (id) {
      payload.id = id
    }
    if (parentId) {
      payload.parentId = parentId
    }

    return apiService
      .post('/v1/questionfolder/', payload)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async updateQuestionFolder(id: string, data: QuestionTreeEmpty): Promise<any> {
    return apiService
      .put(`/v1/questionfolder/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteQuestionFolder(id: string): Promise<any> {
    return apiService
      .delete(`/v1/questionfolder/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async shareQuestionFolder(id: string, data: SharePermission): Promise<any> {
    return apiService
      .post(`/v1/questionfolder/share/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new QuestionFolderService()
