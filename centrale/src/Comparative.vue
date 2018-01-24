<template>
  <div id="comparative">
    <h1>Comparison:</h1>
    <select v-model='current_property'>
      <option v-for='prop in $store.state.properties' :value="prop">{{prop}} </option>
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
    // Without this functions, the values, which are nested, don't update on display
    updateValues: function(){
      // Forcing the display update
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
  width: 20vw;
}
</style>
