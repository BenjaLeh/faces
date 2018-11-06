<template lang="pug">
  v-app#inspire
    v-content
      v-container(fluid, fill-height)
        v-layout(align-center, justify-center)
          v-flex(xs12, sm8, md4)
            v-card.elevation-12
              v-toolbar(dark, color='primary')
                v-toolbar-title Login form
              v-flex(xs12)
                v-img.my-3(:src="require('../assets/logo.svg')", contain, height='100')
              v-card-text
                v-form
                  v-text-field(prepend-icon='person', name='login', label='Login', type='text')
                  v-text-field#password(prepend-icon='lock', name='password', label='Password', type='password')
              v-card-actions
                v-spacer
                v-btn(color='primary') Login
</template>

<script>
  export default {
    data: () => ({
      drawer: null
    }),

    props: {
      source: String
    }
  }
</script>