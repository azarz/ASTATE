<template>
  <div id="mapping">
    <v-map :zoom=4 :center="[45,3]">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
      <v-marker v-for="probe in $store.state.probes" :lat-lng="probe.latlng" :icon="probe.icon"></v-marker>
    </v-map>
  </div>
</template>

<script>
export default {
  name: 'mapping',
  data () {
    return {}
  },
  methods: {
    updateValues: function(){
      this.$store.commit('updateData', this);

      setTimeout(this.updateValues, 3000);
    }
  },
  mounted: function(){
    this.$forceUpdate();
  }
}
</script>

<style lang="scss">
#mapping {
  height: 350px; 
  width: 70vw;
}

h1, h2 {
  font-weight: normal;
}

</style>
