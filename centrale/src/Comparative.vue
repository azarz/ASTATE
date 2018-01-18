<template>
  <div id="comparative">
    <h1>Comparison:</h1>
    <select v-model='current_property'>
      <option v-for='prop in $store.state.properties' :value="prop">{{prop}}</option>
    </select>  
    <table>
      <tr v-for='probe in $store.state.probes'><th scope='row'>{{ probe.address }}:</th><td>{{ probe[current_property] }}</td></tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'comparative',
  data () {
    return {
      current_property: 'temperature'
    }
  },
  methods: {
    updateValues: function(){
      this.$forceUpdate();

      setTimeout(this.updateValues, 3000);
    }
  },
  mounted: function(){
    this.updateValues();
  }
}
</script>

<style lang="scss">
#comparative {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 40vw;
}

h1, h2 {
  font-weight: normal;
}

</style>
