<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

#app > img {
  width: 220px;
}
</style>
