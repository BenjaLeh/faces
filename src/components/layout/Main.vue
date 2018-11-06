<template lang="pug">
  v-app#inspire
    v-navigation-drawer(:clipped='$vuetify.breakpoint.lgAndUp', v-model='drawer', fixed, app)
      v-list(dense)
        template(v-for='item in items')
          v-layout(v-if='item.heading', :key='item.heading', row, align-center)
            v-flex(xs6)
              v-subheader(v-if='item.heading')
                | {{ item.heading }}
            v-flex.text-xs-center(xs6)
              a.body-2.black--text(href='#!') EDIT
          v-list-group(v-else-if='item.children', v-model='item.model', :key='item.text', :prepend-icon="item.model ? item.icon : item['icon-alt']", append-icon)
            v-list-tile(slot='activator')
              v-list-tile-content
                v-list-tile-title
                  | {{ item.text }}
            v-list-tile(v-for='(child, i) in item.children', :key='i', @click)
              v-list-tile-action(v-if='child.icon')
                v-icon {{ child.icon }}
              v-list-tile-content
                v-list-tile-title
                  | {{ child.text }}
          v-list-tile(v-else, :key='item.text', @click)
            v-list-tile-action
              v-icon {{ item.icon }}
            v-list-tile-content
              v-list-tile-title
                | {{ item.text }}
    v-toolbar(:clipped-left='$vuetify.breakpoint.lgAndUp', color='blue darken-3', dark, app, fixed)
      v-toolbar-title.ml-0.pl-3(style='width: 300px')
        v-toolbar-side-icon(@click.stop='drawer = !drawer')
        span.hidden-sm-and-down Face Detect
      v-text-field.hidden-sm-and-down(flat, solo-inverted, hide-details, prepend-inner-icon='search', label='Buscar')
      v-spacer
      v-btn(icon)
        v-icon apps
      v-btn(icon)
        v-icon notifications
      v-btn(icon, large)
        v-avatar(size='32px', tile)
          img(src='https://cdn.vuetifyjs.com/images/logos/logo.svg', alt='Vuetify')
    v-content
      v-container(fluid)
        v-layout(justify-center, align-center)
          router-view
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
        { icon: 'contacts', text: 'Contacts' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Labels',
          model: true,
          children: [
            { icon: 'add', text: 'Create label' }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'More',
          model: false,
          children: [
            { text: 'Import' },
            { text: 'Export' }
          ]
        },
        { icon: 'settings', text: 'Settings' }
      ]
    }),
    props: {
      source: String
    }
  }
</script>