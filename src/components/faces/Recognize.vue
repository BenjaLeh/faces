<template lang="pug">
  v-container(grid-list-xl, pt-2)
    v-layout
      v-flex(xs8)
        v-toolbar(color='primary', dark)
          v-toolbar-side-icon
          v-toolbar-title Suba una foto por favor...
          v-spacer
          v-btn.white--text(:loading='loadingBtn', :disabled='loadingBtn', color='info', @click="analizeImage()", v-if="!swBtnUploadAnalize")
            | Analizar Imagen
            v-icon(right='', dark='') cloud_upload
          v-btn.white--text(:loading='loadingBtnUpload', :disabled='loadingBtnUpload', color='info', @click="uploadImage()", v-else)
            | Subir Imagen
            v-icon(right='', dark='') cloud_upload

        v-card
          v-container(v-if="swBtnUploadAnalize")
            v-layout(row, wrap)
              v-flex(xs12, v-if="!imagesRevision.length > 0")
                #drop(@drop='handleDrop', @click='handleDrop', @dragover='handleDragover', @dragenter='handleDragover') Click o Arrastre Aqui (jpg, png, jpeg)
                  input(type='file', @change='onFileChange', multiple)
              v-flex(xs12, v-for='imagen in imagesRevision' :key="imagen.id", v-else)
                  v-card(flat, tile)
                    v-responsive(min-height='150px')
                      v-img(:src="imagen.file", width="100%", height="100%")
                      v-btn(absolute small dark fab top right, color='red', style='margin: 20px -10px 0px 0px;', @click="removeElement(imagen.id)")
                        v-icon close
          v-container(v-else)
            v-layout(row, wrap)
              v-flex(xs12)
                div#facesMain
                  img#facesImage(:src="imageUrl")
                  div#facesContainer
                    div.facePosition(v-for='item in items', v-model='item.active', :key='item.id', :style="makeStyle(item.coordinates)") {{ item.title }}
      v-flex(xs4)
        v-toolbar(color='primary', dark)
          v-toolbar-side-icon
          v-toolbar-title Info
          v-spacer
          v-btn(icon)
            v-icon search
        v-layout(row, wrap)
          v-flex(xs12)
            v-card
              //v-list
                template(v-for='item in items')
                  v-list-tile(:key='item.id', avatar, @click)
                    v-list-tile-avatar(v-if="item.status === 'success'")
                      img(:src='item.avatar')
                    v-list-tile-avatar(v-else)
                      v-icon face
                    v-list-tile-content
                      v-list-tile-title(v-html='item.title')
              v-list
                template(v-for='item in items')
                  v-list-tile(:key='item.id', avatar, v-if="item.status === 'success'")
                    v-list-tile-avatar
                      img(:src='item.avatar')
                    v-list-tile-avatar
                      v-icon face
                    v-list-tile-content
                      v-list-tile-title(v-html='item.title')

</template>

<script>
import httpMedia from '@/http/media'
import http from '@/http'
export default {
  name: 'detection',
  data () {
    return {
      imagesRevision: [],
      loadingBtn: false,
      loadingBtnUpload: false,
      swBtnUploadAnalize: true,
      imageUrl: null,
      items: []
    }
  },
  methods: {
    analizeImage () {
      this.analizeImage(this.imageUrl)
    },
    uploadImage () {
      this.loadingBtnUpload = true
      this.imagesRevision.forEach(function (element) {
        this.saveImage(element.file)
      }, this)
    },
    handleDrop (e) { // arrastrar una imagen
      if (e.dataTransfer) {
        this.loading = true
        e.stopPropagation()
        e.preventDefault()
        var files = e.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
          var f = files[i]
          var reader = new FileReader()
          let _this = this
          reader.onload = function (e) {
            var data = e.target.result
            _this.sendToList(data)
          }
          reader.readAsDataURL(f)
        }
      }
    },
    onFileChange (e) { // seleccionar una imagen
      this.loading = true
      var files = e.target.files || e.dataTransfer.files
      for (var i = 0; i < files.length; i++) {
        var f = files[i]
        var reader = new FileReader()
        let _this = this
        reader.onload = function (e) {
          var data = e.target.result
          _this.sendToList(data)
        }
        reader.readAsDataURL(f)
      }
    },
    handleDragover (e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    sendToList (base64) { // agregar un elemento a la lista
      var element = {
        id: (this.imagesRevision.length + 1),
        title: '',
        file: base64
      }
      this.imagesRevision.push(element)
    },
    removeElement (key) { // remover imagen de la lista
      let tempArray = []
      this.imagesRevision.forEach(function (element, index) {
        if (element.id !== key) { tempArray.push(element) }
      }, this)
      this.imagesRevision = tempArray
    },
    saveImage(base64) {
      httpMedia.saveImagen(`base64=${base64}&folder=faces`).then(res => {
        this.loadingBtnUpload = false
        this.swBtnUploadAnalize = false
        this.imageUrl = httpMedia.getImagenUrl(res.data.filepath)
        console.log(httpMedia.getImagenUrl(res.data.filepath))
      }, (error) => {
        this.error = true
        console.log(error)
      })
    },
    analizeImage(path){
      this.loadingBtn = true
      http.recognize(this.imageUrl, 'gge').then(res => {
        this.loadingBtn = false
        res.data.images.forEach(function (element) {
          if (element.transaction.status === 'success') { // existe coincidencia
            let temp = {
              id: element.transaction.face_id,
              status: element.transaction.status,
              icon: 'face',
              title: element.transaction.subject_id,
              avatar: `http://rrhh.miteleferico.bo/images/personal/${element.transaction.subject_id}.jpg`,
              coordinates: { 
                topLeftX: element.transaction.topLeftX, 
                topLeftY: element.transaction.topLeftY, 
                width: element.transaction.width, 
                height: element.transaction.height, 
                quality: element.transaction.quality,
                status: element.transaction.status
              },
              items: []
            }
            this.items.push(temp)
          } else { // No existe coincidencia
            let temp = {
              id: element.transaction.face_id,
              status: element.transaction.status,
              icon: 'mood_bad',
              title: 'Desconocido',
              coordinates: { 
                topLeftX: element.transaction.topLeftX, 
                topLeftY: element.transaction.topLeftY, 
                width: element.transaction.width, 
                height: element.transaction.height, 
                quality: element.transaction.quality,
                status: element.transaction.status
              },
              items: []
            }
            this.items.push(temp)
          }
        }, this)
      }, (error) => {
        this.error = true
        console.log(error)
      })
    },
    makeStyle (coordinate) {
      let color = ''
      if (coordinate.status === 'success')  {
        color = '4CAF50'
      } else {
        color = '990000'
      }
      return `width: ${coordinate.width}px; height: ${coordinate.height}px; top: ${coordinate.topLeftY}px; 
      left: ${coordinate.topLeftX}px; border: 2px solid #${color}; color: #${color};`
    }
  }
}
</script>

<style scoped>
  #drop {
    border: 2px dashed #bbb;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    padding: 25px;
    text-align: center;
    font: 20pt bold, "Vollkorn";
    color: #bbb;
    position: relative;
  }
  #drop input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  div#facesMain {
    position: relative;
    float: left;
    width: 800px;
    height: 100%;
  }
  #facesImage {
    position: absolute;
    top: 0;
    left: 0; 
  }
  div#facesContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  div.facePosition {
    position: absolute;
    font-size: 20px;
    font-weight: bold;
    padding-left: 5px;
  }
</style>
