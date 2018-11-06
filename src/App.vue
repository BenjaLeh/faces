<template lang="pug">
  div
    transition(mode='out-in')
      router-view
</template>

<script>

export default {
  name: 'App',
  data () {
    return {}
  }
}
</script>
