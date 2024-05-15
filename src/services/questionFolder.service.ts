import apiService from '@services/api.service'

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
}

export default new QuestionFolderService()
