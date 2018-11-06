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
                    div.facePosition(v-for='item in items', v-model='item.active', :key='item.title', :style="makeStyle(item.coordinates)") {{ item.title }}
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
              v-list(two-line)
                v-list-group(v-for='item in items', v-model='item.active', :key='item.title', :prepend-icon='item.icon', no-action)
                  v-list-tile(slot='activator')
                    v-list-tile-content
                      v-list-tile-title {{ item.title }}
                  v-list-tile(v-for='subItem in item.items', :key='subItem.title', @click)
                    //v-list-tile-avatar
                      img(:src="subItem.avatar")
                    v-list-tile-content
                      v-list-tile-title {{ subItem.title }}
                      v-list-tile-sub-title {{ subItem.subtitle }}
                    v-list-tile-action
                      v-icon {{ subItem.action }}

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
      // imageUrl: 'http://tarjetas.miteleferico.bo/uploads/faces/20181106_084820167545762.jpg',
      imageUrl: null,
      items: []
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
        res.data.images.forEach(function (element) {
          console.log(element.faces)
          element.faces.forEach(function (subelement) {
            console.log(subelement.attributes)
            let temp = {
              icon: 'face',
              title: subelement.face_id,
              coordinates: { 
                topLeftX: subelement.topLeftX, 
                topLeftY: subelement.topLeftY, 
                width: subelement.width, 
                height: subelement.height, 
                quality: subelement.quality
              },
              items: [
                { avatar: '', title: 'Edad aproximada', subtitle: `${subelement.attributes.age} años` },
                { avatar: '', title: 'Genero', subtitle: subelement.attributes.gender.type },
                { avatar: '', title: 'Lentes', subtitle: subelement.attributes.glasses },
                { avatar: '', title: 'Rasgos Raciales', subtitle: `Asiatico: ${Number((subelement.attributes.asian).toFixed(2))} - 
                  Negro: ${Number((subelement.attributes.black).toFixed(2))} - Hispano: ${Number((subelement.attributes.hispanic).toFixed(2))}
                   - Blanco: ${Number((subelement.attributes.white).toFixed(2))}` }
              ]
            }
          this.items.push(temp)
          
          }, this)
        }, this)
      }, (error) => {
        this.error = true
        console.log(error)
      })
    },
    makeStyle (coordinate) {
      return `width: ${coordinate.width}px; height: ${coordinate.height}px; top: ${coordinate.topLeftY}px; left: ${coordinate.topLeftX}px;`
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
    border: 2px solid #990000;
    position: absolute;
    color: #990000;
    font-size: 20px;
    font-weight: bold;
    padding-left: 5px;
  }
</style>
