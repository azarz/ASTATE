<template>
  <div id="dashboard">
    <h1>Data from probe:
      <select v-model='probe_address'>
        <option v-for='address in $store.state.probeAddresses' :value="address">{{address}}</option>
      </select>  
    </h1>
    <table>
      <tr v-for='property in $store.state.properties'><th scope='row'>{{property}}:</th><td>{{ current_probe[property] }}</td></tr>
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
      // Updating the store data, this vue is the only one responsible for that
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
  width: 33vw;
}

td{
  text-align: right;
}

th{
  text-align: left;
}
</style>
