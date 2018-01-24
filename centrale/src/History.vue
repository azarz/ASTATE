<template>
  <!-- If the data is loading, we display a nive loading gif -->
  <div id="loading" v-if="loading">
    <div>
      <p><img src="./assets/loading.gif" alt="loading gif"></p>
      <p>Loading history...</p>
    </div>
  </div>

  <!-- If any select value is changed, we get the history using the getHistory() method -->
  <div id="history" v-else>
    <h1>History from probe:
      <select v-model='probe_address' @change="getHistory">
        <option v-for='address in $store.state.probeAddresses' :value="address">{{address}}</option>
      </select>
    </h1>
    <p>value: <select v-model='property' @change="getHistory">
      <option v-for='prop in $store.state.properties' :value="prop">{{prop}}</option>
    </select>
    period:
      <select v-model='time_period' @change="getHistory">
        <option :value="60000">1 minute</option>
        <option :value="3600000">1 hour</option>
        <option :value="86400000">1 day</option>
        <option :value="604800000">1 week</option>
        <option :value="2592000000">1 month</option>
        <option :value="31557600000">1 year</option>
      </select>
    </p>
    <history-chart :datesarray="dates_array" :property="property" :propertyarray="property_array"></history-chart>
  </div>
</template>

<script>
// Importing the chart component
import HistoryChart from './HistoryChart';

export default {
  name: 'history',
  components: { HistoryChart },
  data () {
    return {
      probe_address: this.$store.state.probeAddresses[0],
      // The time period in miliseconds, linked to the value in the period HTML select
      time_period: 86400000,
      property: 'temperature',
      dates_array: [],
      property_array: [],
      loading: false
    }
  },
  computed: {
    current_probe: function(){
      return this.$store.state.probes[this.probe_address];
    }
  },
  methods: {
    // A function to get the history from a given probe, for a given property and for a given time period
    getHistory: function(){
      // Calculating the start and stop dates according to the current time
      let stop = new Date(Date.now());
      let start = new Date(stop.getTime() - this.time_period);

      // Activating the loading state
      this.loading = true;

      // Fetching the history from the API
      fetch('http://' + this.probe_address + ':3000/interval/?start=' + start.toISOString() + '&stop=' + stop.toISOString()).then(result=>{
        return result.json();
      }).then(result=>{
          let measurements_array = result.measurements;
          let rainfall_array = result.rainfall;

          // Reversing the array order since the API returns the data in last to first order
          // And separating the mesurements/rainfall cases
          if (this.property != 'rainfall'){
            this.dates_array = measurements_array.map(measure=>measure.date).reverse();
            this.property_array = measurements_array.map(measure=>measure[this.property]).reverse();
          } else {
            this.dates_array = rainfall_array.map(measure=>measure.date).reverse();
            this.property_array = rainfall_array.map(measure=>1).reverse();
          }

          // Transforming the dates into more readable strings
          for(let i = 0; i < this.dates_array.length; i++){
            let date = new Date(this.dates_array[i]);
            let finalString = "";
            finalString += date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
            finalString += " ";
            finalString += date.getHours();
            finalString += ":";
            finalString += date.getMinutes();
            this.dates_array[i] = finalString;
          }

          // Stopping the loading state
          this.loading = false;

      }).catch(()=>{
        // If there is an error, we stop the loading and return no data
        this.dates_array = [];
        this.property_array = [];
        this.loading=false;
      });
    }
  },

  mounted: function() {
    // Getting the history first when mounted
    this.getHistory();
  }
}
</script>

<style lang="scss">
#history {
  width: 50vw;
}

#loading {
  width: 50vw;
  z-index: 10000;
  background-color: rgba(0,0,0,0.05);

  display: flex;
  flex-direction: column;
  justify-content: center;
}

#loading img {
  width: 50px;
}

canvas {
  height: 25vh;
}


</style>
