<template>
  <div id="dashboard">
    <h1>Data from  
      <select v-model='probe_address'>
        <option v-for='address in $store.state.probeAddresses' :value="address">{{address}}</option>
      </select>  
    probe:</h1>
    <table>
      <tr><th scope='row'>temperature:</th><td>{{ current_probe.temperature }}</td></tr>
      <tr><th scope='row'>temperature:</th><td>{{ current_probe.temperature }}</td></tr>
      <tr><th scope='row'>pressure:</th><td>{{ current_probe.pressure }}</td></tr>
      <tr><th scope='row'>humidity:</th><td>{{ current_probe.humidity }}</td></tr>
      <tr><th scope='row'>luminosity:</th><td>{{ current_probe.luminosity }}</td></tr>
      <tr><th scope='row'>wind_heading:</th><td>{{ current_probe.wind_heading }}</td></tr>
      <tr><th scope='row'>wind_speed_avg:</th><td>{{ current_probe.wind_speed_avg }}</td></tr>
      <tr><th scope='row'>wind_speed_max:</th><td>{{ current_probe.wind_speed_max }}</td></tr>
      <tr><th scope='row'>wind_speed_min:</th><td>{{ current_probe.wind_speed_min }}</td></tr>
      <tr><th scope='row'>rainfall:</th><td>{{ current_probe.rainfall }}</td></tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      probe_address: this.$store.state.probeAddresses[0]
    }
  },
  computed: {
    current_probe: function(){
      return this.$store.state.probes[this.probe_address];
    }
  },

  methods: {
    updateValues: function(){
      this.$store.commit('updateData', this);

      setTimeout(this.updateValues, 3000);
    }
  },
  mounted: function(){
    this.updateValues();
  }
}
</script>

<style lang="scss">
#dashboard {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 33vw;
}

h1, h2 {
  font-weight: normal;
}

td{
  text-align: right;
}

th{
  text-align: left;
}
</style>
