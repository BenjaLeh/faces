<template lang="pug">
  v-container(grid-list-xl, pt-2)
    v-layout
      v-flex(xs6)
        v-toolbar(color='primary', dark)
          v-toolbar-side-icon
          v-toolbar-title Suba una foto por favor...
          v-spacer
          //v-btn(icon)
            v-icon search
          v-btn.white--text(:loading='loadingBtn', :disabled='loadingBtn', color='info', @click="analizeImage()", v-if="!swBtnUploadAnalize")
            | Analizar Imagen
            v-icon(right='', dark='') cloud_upload
          v-btn.white--text(:loading='loadingBtnUpload', :disabled='loadingBtnUpload', color='info', @click="uploadImage()", v-else)
            | Subir Imagen
            v-icon(right='', dark='') cloud_upload

        v-card
          v-container
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
      v-flex(xs6)
        v-toolbar(color='primary', dark)
          v-toolbar-side-icon
          v-toolbar-title Info
          v-spacer
          v-btn(icon)
            v-icon search
        v-card
          v-container
            v-layout(row, wrap)
              v-flex(xs12)
                | Listen to your favorite artists and albums whenever and wherever, online and offline.
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
      imageUrl: ''
    }
  },
  methods: {
    analizeImage () {
      this.loadingBtn = true
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
      http.detection(this.imageUrl).then(res => {
        console.log('detect::::::::::::')
        console.log(res)
      }, (error) => {
        this.error = true
        console.log(error)
      })
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
</style>
