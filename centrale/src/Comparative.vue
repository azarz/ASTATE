<template>
  <div id="comparative">
    <h1>{{ msg }}</h1>
    <select v-model='current_property'>
      <option v-for='prop in $store.state.properties' :value="prop">{{prop}}</option>
    </select>  
    <table>
      <tr v-for='address in $store.state.probeAddresses'><th scope='row'>{{ address }}:</th><td>{{ address.current_property }}</td></tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'comparative',
  data () {
    return {
      msg: 'comparative',
      current_property: 'temperature'
    }
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
