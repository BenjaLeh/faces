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
  const params = `{"image":"${image}"}`
  return http.post('detect', params)
}

http.galleryList = function (name) {
  headers()
  const params = `{"gallery_name":"${name}"}`
  return http.post('gallery/view', params)
}

http.galleryEnroll = function (image, id, gallery) {
  headers()
  const params = `{
    "image":"${image}",
    "subject_id":"${id}",
    "gallery_name":"${gallery}"
  }`
  return http.post('enroll', params)
}

http.recognize = function (image, gallery) {
  headers()
  const params = `{
    "image":"${image}",
    "gallery_name":"${gallery}"
  }`
  return http.post('recognize', params)
}

export default http
