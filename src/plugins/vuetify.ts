import Vue from 'vue'
import Vuetify from 'vuetify'
import { VApp, VContainer, VLayout, VContent, VFlex, VNavigationDrawer, VSpacer } from "vuetify/lib"
import { VCard, VCardText, VCardActions, VToolbar, VToolbarTitle, VToolbarSideIcon } from "vuetify/lib"
import { VBtn, VTextField, VTooltip, VIcon, VForm,  VImg, VAvatar, VResponsive } from "vuetify/lib"
import { VList, VListTile, VListTileTitle, VListTileContent, VListTileAction, VListGroup } from "vuetify/lib"
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  components: { VApp, VContainer, VLayout, VContent, VFlex, VCard, VCardText, VCardActions, 
    VToolbar, VToolbarTitle, VSpacer, VBtn, VTextField, VTooltip, VIcon, VForm, 
  VImg, VNavigationDrawer, VAvatar, VToolbarSideIcon, VListTileTitle, 
VListTileContent, VListTileAction, VListTile, VListGroup, VList, VResponsive }
})
