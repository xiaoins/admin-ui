import request from '@/utils/request'

/**
 * 上传单个文件
 */
export function uploadSingle(file: File, type: string = 'other') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  return request({
    url: '/upload/single',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 批量上传文件
 */
export function uploadBatch(files: File[], type: string = 'other') {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })
  formData.append('type', type)

  return request({
    url: '/upload/batch',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 删除文件
 */
export function deleteFile(url: string) {
  return request({
    url: '/upload',
    method: 'delete',
    params: { url }
  })
}

