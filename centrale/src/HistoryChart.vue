<script>
export default {
  extends: VueChartJs.Line,
  name: 'history-chart',
  props: ['datesarray','property','propertyarray'],
  methods: {
    // Using the vue-chartjs module (https://github.com/apertureless/vue-chartjs)
    render: function() {
      let dataset = {
              label: this.property,
              backgroundColor: 'lightblue',
              borderColor: 'rgba(0,0,0,0)',
              data: this.propertyarray,
              lineTension: 0
            }
      
      if (this.property != 'rainfall'){
        dataset.pointRadius = 0;
      } else{
        // Since rainfall is a boolean, there are no lines
        dataset.borderWidth= 0;
        dataset.fill = false;
      }

      let options = {
          labels: this.datesarray,
          datasets: [dataset]
        }

      this.renderChart(options, {responsive: true, maintainAspectRatio: false})
    }
  },
  /** Need to watch since "the chart does not update itself if new data arrives, 
  because you only pass the data to the chartjs render function which creates an instance and draw the chart on the canvas."
  (https://github.com/apertureless/vue-chartjs/issues/10)*/
  watch: {
    'property': {
      handler: function () {
        this.render();
      },
      deep: true
    },
    'datesarray': {
      handler: function () {
        this.render();
      },
      deep: true
    },
    'propertyarray': {
      handler: function () {
        this.render();
      },
      deep: true
    },
  },
  mounted: function() {
    this.render();
  }
}
</script>
