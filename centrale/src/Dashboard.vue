<template>
  <div id="dashboard">
    <h1>Data from dummy probe:</h1>
    <ul>
      <li>temperature: {{ temperature }}</li>
      <li>pressure: {{ pressure }}</li>
      <li>humidity: {{ humidity }}</li>
      <li>luminosity: {{ luminosity }}</li>
      <li>wind_heading: {{ wind_heading }}</li>
      <li>wind_speed_avg: {{ wind_speed_avg }}</li>
      <li>wind_speed_max: {{ wind_speed_max }}</li>
      <li>wind_speed_min: {{ wind_speed_min }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      temperature: '',
      pressure: '',
      humidity: '',
      luminosity: '',
      wind_heading: '',
      wind_speed_avg: '',
      wind_speed_max: '',
      wind_speed_min: ''
    }
  },
  methods: {
    updateValues: function(){
      fetch('http://172.31.58.20:3000/test').then(result=>{
        return result.json();}).then(result=>{
          let measurements = result.measurements[0];
          this.temperature = measurements.temperature;
          this.pressure = measurements.pressure;
          this.humidity = measurements.humidity;
          this.luminosity = measurements.luminosity;
          this.wind_heading = measurements.wind_heading;
          this.wind_speed_avg = measurements.wind_speed_avg;
          this.wind_speed_max = measurements.wind_speed_max;
          this.wind_speed_min = measurements.wind_speed_min;
        });
    }
  },
  mounted: function(){this.updateValues();}
}
</script>

<style lang="scss">
#dashboard {
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
