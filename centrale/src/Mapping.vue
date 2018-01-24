<template>
  <div id="mapping">
    <v-map :zoom=4 :center="[45,3]">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
      <!-- All the work is done using the Vue2leaflet module (https://github.com/KoRiGaN/Vue2Leaflet) 
        The only parameters are the probes positions and icons-->
      <v-marker v-for="probe in $store.state.probes" :lat-lng="probe.latlng" :icon="probe.icon"></v-marker>
    </v-map>
  </div>
</template>

<script>
export default {
  name: 'mapping',
  data () {
    return {}
  }
}
</script>

<style lang="scss">
#mapping {
  width: 70vw;
}
</style>
