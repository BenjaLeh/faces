import axios from 'axios'
import config from '@/http/config'

var http = axios.create({
  baseURL: config.apiFaceRecognition,
  headers: headers()
})

function headers () {
  return {
    'Content-Type': 'application/json',
    'app_id': config.appID,
    'app_key': config.appKEY
  }
}

http.detection = function (image) {
  headers()
  const params = `image=${image}`
  return http.post('detect', params)
}

export default http
