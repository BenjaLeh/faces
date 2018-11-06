import axios from 'axios'
import config from '@/http/config'

var http = axios.create({
  baseURL: config.mediaUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

http.saveImagen = function (params) {
  return http.post('/tarjeta/saveimagen', params)
}

http.getImagenUrl = function (path) {
  return `${config.mediaUrlPublic}/${path}`
}

export default http
