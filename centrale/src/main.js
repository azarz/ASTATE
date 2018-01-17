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

const store = new Vuex.Store({
	state:{
		probeAddresses: ['172.31.58.22','172.31.58.20', '172.31.43.61'],
		properties: ['temperature', 'pressure', 'humidity', 'luminosity', 'wind_heading', 'wind_speed_avg',
		'wind_speed_max','wind_speed_min']
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