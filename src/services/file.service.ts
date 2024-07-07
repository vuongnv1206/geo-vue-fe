import ApiService from '@services/api.service'

class FileService {
  async uploadFile(files: any): Promise<any> {
    const formData = new FormData()
    files.forEach((file: any) => {
      formData.append('Files', file)
    })
    return ApiService.post('/v1/files/upload-multiple', formData)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  //   async deleteFile(id: string): Promise<any> {
  //     return ApiService.delete(`/v1/files/delete-multiple/${id}`)
  //       .then((response) => {
  //         return Promise.resolve(response)
  //       })
  //       .catch((error) => {
  //         return Promise.reject(error)
  //       })
  //   }
}

export default new FileService()
