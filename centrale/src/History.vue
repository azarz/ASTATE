<template>
  <div id="history">
    <h1>History from 
      <select v-model='current_probe'>
        <option v-for='address in $store.state.probeAddresses' :value="address">{{address}}</option>
      </select>  
    probe:</h1>
    <p>history from 
      <select v-model='time_period'>
        <option :value="1">1 week</option>
        <option :value="10">1 month</option>
        <option :value="100">1 year</option>
      </select>
    </p>
  </div>
</template>

<script>
export default {
  name: 'history',
  data () {
    return {
      current_probe: '172.31.58.22',
      time_period: 1
    }
  },
  created: function(){
    fetch('http://' + this.current_probe + ':3000/last/').then(result=>
      result.json()).then(result=>{
        this.msg = result;
      });
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
