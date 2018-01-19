import Vue from 'vue';
import Vue2Leaflet from 'vue2-leaflet';
import Vuex from 'vuex';

import Dashboard from './Dashboard.vue'
import History from './History.vue'
import Comparative from './Comparative.vue'
import Mapping from './Mapping.vue'

Vue.use(Vuex);

Vue.component('v-map', Vue2Leaflet.Map);
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer);
Vue.component('v-marker', Vue2Leaflet.Marker);

function headingDegreesToDirection(degrees){
  // Clockwise rotation
  if (degrees < 22.5 || degrees >= 337.5){
    return 'South to North';
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return 'Southwest to Northeast';
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return 'West to East'
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return 'Northwest to Southeast';
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return 'North to South';
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return 'Northeast to Southwest';
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return 'East to West';
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return 'Southeast to Northwest';
  } else {
    return 'unknown';
  }
}

const sunicon = L.icon({
      iconUrl: './src/assets/sun.png',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
const cloudicon = L.icon({
    iconUrl: './src/assets/cloud.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
const rainicon = L.icon({
    iconUrl: './src/assets/rain.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });


const Probe = function(address) {
  this.address = address;
  this.latlng = [90,0];

  this.updateValues = function(){
    fetch('http://' + this.address + ':3000/last/').then(result=>{
        return result.json();
      }).then(result=>{
          let measurements = result.measurements[0];
          let location = result.location[0];
          this.temperature = measurements.temperature;
          this.pressure = measurements.pressure;
          this.humidity = measurements.humidity;
          this.luminosity = measurements.luminosity;
          this.wind_heading = headingDegreesToDirection(measurements.wind_heading);
          this.wind_speed_avg = measurements.wind_speed_avg;
          this.wind_speed_max = measurements.wind_speed_max;
          this.wind_speed_min = measurements.wind_speed_min;

          let data_rainfall = new Date(result.rainfall[0].date);
          let current_date = new Date(Date.now());

          this.rainfall = (current_date.getTime() - data_rainfall.getTime()) < 15000;

          this.latlng = [location.latitude, location.longitude];

          this.icon = sunicon;
          if (this.rainfall) {
            this.icon = rainicon;
          } else if(result.measurements[0].pressure < 995){
            this.icon = cloudicon;
          }
    });
  }
}


const store = new Vuex.Store({
	state:{
    probeAddresses: ['172.31.43.60','172.31.58.22'],//,'172.31.58.30','172.31.43.61'],
		probes: {
      '172.31.43.60': new Probe('172.31.43.60'),
      '172.31.58.22': new Probe('172.31.58.22')
      //'172.31.58.30': new Probe('172.31.58.30'),
      //'172.31.43.61': new Probe('172.31.43.61')
    },
		properties: ['temperature', 'pressure', 'humidity', 'luminosity', 'wind_heading', 'wind_speed_avg',
		'wind_speed_max','wind_speed_min', 'rainfall']
	},
  mutations: {
    updateData: function(state, vue) {
      state.probeAddresses.forEach((probeAdr)=>{
        state.probes[probeAdr].updateValues();
      });
      vue.$forceUpdate();
    }
  }
});


new Vue({
  el: '#dashboard',
  store,
  render: h => h(Dashboard)
});

new Vue({
  el: '#history',
  store,
  render: h => h(History)
});

new Vue({
  el: '#comparative',
  store,
  render: h => h(Comparative)
});

new Vue({
  el: '#mapping',
  store,
  render: h => h(Mapping)
});