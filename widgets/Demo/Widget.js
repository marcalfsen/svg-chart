///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare', 'jimu/BaseWidget', './highcharts', "dojo/query"],
  function (declare, BaseWidget, highcharts, query) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // DemoWidget code goes here

      //please note that this property is be set by the framework when widget is loaded.
      //templateString: template,

      baseClass: 'jimu-widget-demo',

      postCreate: function () {

      },

      startup: function () {
        query('.closeContent').on("click", (function () {
          document.getElementById('moreInfo').style.display = 'none';
        }));
      },

      onOpen: function () {

        var layers = this.map.getLayersVisibleAtScale(this.map.getScale());


        var popay_data = this.config.groups;

        var classificationData = [],
          elementData = [];
        var total = 0
        var TotalValue = 0;
        var totalPercent = 0;
        for (let k = 0; k < popay_data.length; k += 1) {

          TotalValue = 0;
          for (let m = 0; m < layers[1].graphics.length; m += 1) {

            TotalValue += layers[1].graphics[m].attributes[popay_data[k].name];

            if (layers[1].graphics.length == m + 1) {
              popay_data[k].value = TotalValue;
              totalPercent += TotalValue;
            }
          }

          if (popay_data.length == k + 1) {
            for (let g = 0; g < popay_data.length; g += 1) {

              var a = Math.round(popay_data[g].value / totalPercent * 100);
              for (let z = 0; z < popay_data[g].thematiques.length; z += 1) {
                popay_data[g].thematiques[z].val = a / popay_data[k].note;

              }

              popay_data[g].percentage = 'Value: ' + popay_data[g].value + " (" + a + '%)';
            }
          }
        }


        /* for (let q = 0; q < popay_data.length; q += 1) {

          for (let l = 0; l < popay_data[q].thematiques.length; l += 1) {
            var arr = [];
            for (let n = 0; n < layers[1].graphics.length; n += 1) {
              if (layers[1].graphics[n].attributes[popay_data[q].thematiques[l].ele] != null)
                arr.push(layers[1].graphics[n].attributes[popay_data[q].thematiques[l].ele]);
              if (layers[1].graphics.length == n + 1) {
                popay_data[q].thematiques[l].fields = arr.toString();
              }
            }
          }
        } */


        for (let i = 0; i < popay_data.length; i += 1) {
          for (let y = 0, total = 0; y < popay_data[i].note; y += 1) {

            elementData.push({
              "name": popay_data[i].thematiques[y].alias,
              "y": popay_data[i].thematiques[y].val,
              "additionalData": 'Click here for more info!'
              //"additionalData": popay_data[i].thematiques[y].fields
            });

            total += popay_data[i].thematiques[y].val;

          };


          console.log('total de ' + popay_data[i].name + ' est ' + total)

          //place where percentage can be shown
          classificationData[i] = {

            name: popay_data[i].alias,

            y: popay_data[i].value,

            color: popay_data[i].color,

            nrElements: popay_data[i].note,

           // additionalData: popay_data[i].percentage
           additionalData: popay_data[i].popupInfo,

          };



        }

        console.log(elementData)
        console.log(classificationData)



        // Add the color to the 2nd level array, a brightness variation for each base color (per classification)

        for (var i = 0, e = 0; i < popay_data.length; i += 1) {

          var elementsOfClass = classificationData[i].nrElements;



          for (var j = 0; j < elementsOfClass; j += 1) {

            // create n brightness adjustements, within the 25 pct range.

            var brightness = (1 - ((elementsOfClass - j) / elementsOfClass)) / 4;

            elementData[e].color = Highcharts.Color(classificationData[i].color).brighten(brightness).get();

            e = e + 1;

          }

        };



        // Create the chart

        var chart = new Highcharts.Chart({
          chart: {
            type: 'pie',
            height: 400,
            renderTo: 'container'
          },
          title: {
            text: this.config.title
          },

          plotOptions: {

            pie: {

              center: ['50%', '50%'],

              startAngle: -90 // showing data starts at -90 degrees for both series

            },
            series: {
              cursor: 'pointer',
              point: {
                events: {
                  click: function () {

                    for (let y = 0; y < popay_data.length; y += 1) {
                      for (let x = 0; x < popay_data[y].thematiques.length; x += 1) {
                        if (popay_data[y].thematiques[x].alias == this.options.name) {
                          document.getElementById("imgSRC").src = popay_data[y].thematiques[x].imageSRC;
                          document.getElementById("contentSRC").innerHTML = popay_data[y].thematiques[x].description;
                          document.getElementById('moreInfo').style.display = 'block';
                        }
                      }
                    }

                  }
                }
              }
            }
          },

          tooltip: {
            formatter: function () {
              return this.point.additionalData;
            }
          },
          series: [{

            name: 'Total', // shown in the tooltip

            data: classificationData,

            size: '60%', // inner donut

            dataLabels: {

              color: 'white',


              style: {
                "textShadow": "0 0 0 contrast, 0 0 0 contrast",
                "fontSize": 10 + 'px'
              },

              distance: -50

            }
          }, {

            name: popay_data.currency, // shown in the tooltip

            data: elementData,

            size: '100%',

            innerSize: '65%' // a little more then the 60% of the first serie

          }]
        });




      },


      onClose: function () {
        console.log('onClose');
      },

      onMinimize: function () {
        console.log('onMinimize');
      },

      onMaximize: function () {
        console.log('onMaximize');
      },

      onSignIn: function (credential) {
        /* jshint unused:false*/
        console.log('onSignIn');
      },

      onSignOut: function () {
        console.log('onSignOut');
      },


    });
  });