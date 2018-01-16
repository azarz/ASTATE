<template>
  <div id="mapping" style="height: 300px">
  <v-map :zoom=13 :center="[47.413220, -1.219482]">
    <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
    <v-marker :lat-lng="[47.413220, -1.219482]"></v-marker>
  </v-map>
</div>
</template>

<script>
export default {
  name: 'mapping',
  data () {
    return {
      msg: 'maps'
    }
  }
}
</script>

<style lang="scss">
#mapping {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
