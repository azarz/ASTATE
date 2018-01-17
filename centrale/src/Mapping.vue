<template>
  <div id="mapping">
    <v-map :zoom=4 :center="[45,3]">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
      <v-marker v-for="probe in probes" :lat-lng="probe.latlng" :icon="probe.icon"></v-marker>
    </v-map>
  </div>
</template>

<script>
const probeAddresses = ['172.31.58.22','172.31.58.20'];

export default {
  name: 'mapping',
  data () {
    return {
      probes: [],
      sunicon: L.icon({
          iconUrl: './src/assets/sun.png',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        }),
      cloudicon: L.icon({
          iconUrl: './src/assets/cloud.png',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        }),
    }
  },
  computed: {
    latlng: function() {
      return [this.latitude,this.longitude];
    }
  },
  methods: {
    updateValues: function(){
      this.probes = [];
      probeAddresses.forEach(address=>{
        fetch('http://'+ address + ':3000/last').then(result=>{
          return result.json();
        }).then(result=>{
          let location = result.location[0];
          let weather = this.sunicon;
          if(result.measurements[0].wind_speed_min > 25){
            weather = this.cloudicon;
          }

          this.probes.push({
            latlng: [location.latitude, location.longitude],
            icon: weather
          });
        });
      })

      setTimeout(this.updateValues, 2000);
    }
  },

  mounted: function(){
    this.updateValues();
  }

}
</script>

<style lang="scss">
#mapping {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 350px; 
  width: 50vw;
}

h1, h2 {
  font-weight: normal;
}

</style>
