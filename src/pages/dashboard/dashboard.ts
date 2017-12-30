import { DefApiProvider } from '../../providers/api/def-api';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import * as _ from "lodash";
import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  orderCounts: any;
  orderStatus: any;
  orderPendingCount: any;
  orderDayCount: any;
  orderTotalCount: any;
  

  constructor(public navCtrl: NavController,
    public defApi: DefApiProvider,
    public menu: MenuController,
    private translate : TranslateService) {
    menu.swipeEnable(true, 'menu');
  }

  ionViewDidLoad() {
    this.loadInit();
  }

  loadInit() {
    let today = moment().format('YYYY-MM-DD'); ;
    let markAsDeliveryDate = 0;
    let deliveryDate = today;

    this.defApi.getDashboardOrderCount(markAsDeliveryDate, deliveryDate).subscribe(data => {
      this.orderCounts = data.orders_status_counts;
      this.loadBarChart();
    });

    this.defApi.getDashboardOrderStatus().subscribe(data => {
      this.orderStatus = data.orders_status_counts;
      this.loadOrderStatus();
    });
  }

  viewOrder(status_id){
    this.navCtrl.push('HomePage', status_id);
  }

  loadOrderStatus(){
    if(this.orderStatus != null){
        let orderPending = _.find(this.orderStatus, function(o) { return o.order_status_id == 1; });
        if(orderPending != null){
          this.orderPendingCount = orderPending.order_count;
        } else{
          this.orderPendingCount = 0;
        }
        let orderInDay = _.find(this.orderStatus, function(o) { return o.order_status_id == 2; });
        if(orderInDay != null){
          this.orderDayCount = orderInDay.order_count;
        } else{
          this.orderDayCount = 0;
        }
        let orderTotal = _.find(this.orderStatus, function(o) { return o.order_status_id == 3; });
        if(orderTotal != null){
          this.orderTotalCount = orderTotal.order_count;
        } else{
          this.orderTotalCount = 0;
        }
    }
  }

  loadBarChart() {
    let labels = [];
    let data = [];
    for (let i = 0; i < this.orderCounts.length; i++) {
      let status = this.orderCounts[i];
      labels.push(status.order_status_name);
      data.push(status.order_count);
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          label: this.translate.instant("Dashboard.OrderStatus"),
          onClick: function(e){
            console.log("Chart");
          },
          options: { 
            legend: { 
                display: false 
            },
            events: ['click']
          },
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });

    // Define a plugin to provide data labels
    Chart.defaults.global.legend.display = false;
    Chart.plugins.register({
      afterDatasetsDraw: function (chart, easing) {
        // To only draw at the end of animation, check for easing === 1
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function (dataset, i) {
          var meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              // Draw the text in black, with the specified font
              ctx.fillStyle = 'rgb(0, 0, 0)';
              var fontSize = 16;
              var fontStyle = 'normal';
              var fontFamily = 'Helvetica Neue';
              ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
              // Just naively convert to string for now
              var dataString = dataset.data[index].toString();
              // Make sure alignment settings are correct
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              var padding = 5;
              var position = element.tooltipPosition();
              ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
            });
          }
        });
      }
    });
  }


}
