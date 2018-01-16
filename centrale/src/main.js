import Vue from 'vue'
import Dashboard from './Dashboard.vue'
import History from './History.vue'
import Comparative from './Comparative.vue'
import Mapping from './Mapping.vue'
import Vue2Leaflet from 'vue2-leaflet';

Vue.component('v-map', Vue2Leaflet.Map);
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer);
Vue.component('v-marker', Vue2Leaflet.Marker);

new Vue({
  el: '#dashboard',
  render: h => h(Dashboard)
});

new Vue({
  el: '#history',
  render: h => h(History)
});

new Vue({
  el: '#comparative',
  render: h => h(Comparative)
});

new Vue({
  el: '#mapping',
  render: h => h(Mapping)
});