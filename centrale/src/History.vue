<template>
  <div id="history">
    <h1>History from 
      <select v-model='probe_address' @change="getHistory">
        <option v-for='address in $store.state.probeAddresses' :value="address">{{address}}</option>
      </select>  
    probe:</h1>
    <p>history from 
      <select v-model='time_period' @change="getHistory">
        <option :value="60480000">1 week</option>
        <option :value="259200000">1 month</option>
        <option :value="3155760000">1 year</option>
      </select>
    </p>
  </div>
</template>

<script>
export default {
  name: 'history',
  data () {
    return {
      probe_address: this.$store.state.probeAddresses[0],
      time_period: 60480000
    }
  },
  computed: {
    current_probe: function(){
      return this.$store.state.probes[this.probe_address];
    }
  },
  methods: {
    getHistory: function(){
      let stop = new Date(Date.now());
      let start = new Date(stop.getTime() - this.time_period);
      fetch('http://' + this.probe_address + ':3000/interval?start=' + start.toISOString() + '&stop=' + stop.toISOString()).then(result=>{
        return result.json();
      }).then(result=>{
          let measurements = result.measurements[0];
          let location = result.location[0];
          this.temperature = measurements.temperature;
          this.pressure = measurements.pressure;
          this.humidity = measurements.humidity;
          this.luminosity = measurements.luminosity;

          this.wind_speed_avg = measurements.wind_speed_avg;
          this.wind_speed_max = measurements.wind_speed_max;
          this.wind_speed_min = measurements.wind_speed_min;
      });
    }
  },
  mounted: function() {
    this.getHistory();
  }
}
</script>

<style lang="scss">
#history {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 50vw;
}

h1, h2 {
  font-weight: normal;
}

</style>
