<template lang="pug">
  v-container(grid-list-xl, pt-2)
    v-layout(row justify-center)
      v-flex(xs8)
        v-toolbar(color='primary', dark)
          v-toolbar-side-icon
          v-toolbar-title Grupo
          v-spacer
          v-btn(fab dark small color='success', @click.native="swBtnUpload = !swBtnUpload", v-if="swBtnUpload")
            v-icon(dark) add
          v-btn.white--text(:loading='loadingBtnUpload', :disabled='loadingBtnUpload', color='info', @click="uploadImage()", v-else)
            | Subir Imagen
            v-icon(right='', dark='') cloud_upload
        v-card
          v-container(v-if="!swBtnUpload")
            v-layout(row, wrap)
              v-flex(xs12)
                v-form
                  v-container
                    v-layout(row, justify-center)
                      v-flex(xs5)
                        v-text-field(v-model='document', label='Introduzca Documento', solo)
                      v-flex(xs2)
                        v-btn(fab dark small color='success', @click="addImage()")
                          v-icon(dark) play_arrow
              v-flex(xs8, v-for='imagen in imagesRevision' :key="imagen.id")
                  v-card(flat, tile)
                    v-responsive(min-height='150px')
                      v-img(:src="imagen.file", width="200px", height="100%")
                      v-btn(absolute small dark fab top right, color='red', style='margin: 20px -10px 0px 0px;', @click="removeElement(imagen.id)")
                        v-icon close
          v-container(v-else)
            v-layout(row, wrap)
              v-flex(xs12)
                div#facesMain
                  img#facesImage(:src="imageUrl")
                  div#facesContainer
                    div.facePosition(v-for='item in items', v-model='item.active', :key='item.title', :style="makeStyle(item.coordinates)") {{ item.title }}

          v-container
            v-flex(xs12)
              v-card
                v-list
                  template(v-for='(item, index) in subjects')
                    v-list-tile(:key='item.title', avatar, @click)
                      v-list-tile-avatar
                        img(:src='item.avatar')
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
      document: '',
      imagesRevision: [],
      loadingBtnUpload: false,
      swBtnUpload: true,
      imageUrl: null,
      items: [],
      subjects: []
    }
  },
  methods: {
    galleryList() {
      http.galleryList('gge').then(res => {
        res.data.subject_ids.forEach(function (element) {
          var tmp = {
            avatar: `http://rrhh.miteleferico.bo/images/personal/${element}.jpg`,
            title: element
          }
          this.subjects.push(tmp)
        }, this)
      }, (error) => {
        this.error = true
        console.log(error)
      })
    },
    addImage() {
      this.imagesRevision = []
      var element = {
        id: (this.imagesRevision.length + 1),
        title: this.document,
        file: `http://rrhh.miteleferico.bo/images/personal/${this.document}.jpg`
      }
      this.imagesRevision.push(element)
    },
    uploadImage () {
      this.loadingBtnUpload = true
      this.imagesRevision.forEach(function (element) {
        this.enrollImage(element)
      }, this)
    },
    enrollImage(element) {
      http.galleryEnroll(element.file, element.title, 'gge').then(res => {
        /* this.loadingBtnUpload = false
        this.swBtnUpload = true
        this.imageUrl = httpMedia.getImagenUrl(res.data.filepath)
        console.log(httpMedia.getImagenUrl(res.data.filepath)) */
        console.log(res.data)
      }, (error) => {
        this.error = true
        console.log(error)
      })
    },
    removeElement (key) { // remover imagen de la lista
      let tempArray = []
      this.imagesRevision.forEach(function (element, index) {
        if (element.id !== key) { tempArray.push(element) }
      }, this)
      this.imagesRevision = tempArray
    }
  },
  created () {
    this.galleryList()
  }
}
</script>