<template>
  <div id="loading" v-if="loading">
    <div>
      <p><img src="./assets/loading.gif" alt="loading gif"></p>
      <p>Loading history...</p>
    </div>
  </div>
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
import HistoryChart from './HistoryChart'

export default {
  name: 'history',
  components: { HistoryChart },
  data () {
    return {
      probe_address: this.$store.state.probeAddresses[0],
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
    getHistory: function(){
      console.log(this.time_period);
      let stop = new Date(Date.now());
      let start = new Date(stop.getTime() - this.time_period);
      this.loading = true;
      fetch('http://' + this.probe_address + ':3000/interval/?start=' + start.toISOString() + '&stop=' + stop.toISOString()).then(result=>{
        return result.json();
      }).then(result=>{
          let measurements_array = result.measurements;
          let rainfall_array = result.rainfall;
          // Reversing the array order since the API returns the data in last to first order
          if (this.property != 'rainfall'){
            this.dates_array = measurements_array.map(measure=>measure.date).reverse();
            this.property_array = measurements_array.map(measure=>measure[this.property]).reverse();
          } else {
            this.dates_array = rainfall_array.map(measure=>measure.date).reverse();
            this.property_array = rainfall_array.map(measure=>1).reverse();
          }
          this.loading = false;

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
  width: 50vw;
}

h1, h2 {
  font-weight: normal;
}

#loading {
  width: 50vw;
  height: 400px;
  z-index: 10000;
  background-color: rgba(0,0,0,0.05);

  display: flex;
  flex-direction: column;
  justify-content: center;
}

#loading img {
  width: 50px;
}


</style>
