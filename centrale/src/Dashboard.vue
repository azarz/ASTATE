<template>
  <div id="dashboard">
    <h1>Data from  
      <select v-model='current_probe'>
        <option v-for='address in $store.state.probeAddresses' :value="address">{{address}}</option>
      </select>  
    probe:</h1>
    <table>
      <tr><th scope='row'>temperature:</th><td>{{ temperature }}</td></tr>
      <tr><th scope='row'>pressure:</th><td>{{ pressure }}</td></tr>
      <tr><th scope='row'>humidity:</th><td>{{ humidity }}</td></tr>
      <tr><th scope='row'>luminosity:</th><td>{{ luminosity }}</td></tr>
      <tr><th scope='row'>wind_heading:</th><td>{{ wind_heading }}</td></tr>
      <tr><th scope='row'>wind_speed_avg:</th><td>{{ wind_speed_avg }}</td></tr>
      <tr><th scope='row'>wind_speed_max:</th><td>{{ wind_speed_max }}</td></tr>
      <tr><th scope='row'>wind_speed_min:</th><td>{{ wind_speed_min }}</td></tr>
    </table>
  </div>
</template>

<script>
function headingDegreesToDirection(degrees){
  // Clockwise rotation
  if (degrees < 22.5 || degrees >= 337.5){
    return 'North';
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return 'Northeast';
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return 'East'
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return 'Southeast';
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return 'South';
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return 'Southwest';
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return 'West';
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return 'Northwest';
  } else {
    return 'unknown';
  }
}


export default {
  name: 'dashboard',
  data () {
    return {
      current_probe: '172.31.58.20',
      temperature: '',
      pressure: '',
      humidity: '',
      luminosity: '',
      wind_heading: '',
      wind_speed_avg: '',
      wind_speed_max: '',
      wind_speed_min: '',
    }
  },
  methods: {
    updateValues: function(){
      fetch('http://' + this.current_probe + ':3000/last/').then(result=>{
        return result.json();}).then(result=>{
          let measurements = result.measurements[0];
          this.temperature = measurements.temperature;
          this.pressure = measurements.pressure;
          this.humidity = measurements.humidity;
          this.luminosity = measurements.luminosity;
          this.wind_heading = headingDegreesToDirection(measurements.wind_heading);
          this.wind_speed_avg = measurements.wind_speed_avg;
          this.wind_speed_max = measurements.wind_speed_max;
          this.wind_speed_min = measurements.wind_speed_min;
        });

      setInterval(this.updateValues, 2000);
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
