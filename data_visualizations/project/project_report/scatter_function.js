function datasetBubbleChartChosen(group,Sex) {
    var ds=datasetBubbleChart.filter(function (el) {
    return (el.group === group); });
    ds=ds.filter(function (el) {
    return (el.Sex === Sex); });
  return ds;
}


function scatter_func() {

   var firstDdatasetBubbleChart = datasetBubbleChartChosen(group,Sex);   
   // console.log(firstDdatasetBubbleChart);

        // ColorBrewer
    var colors = {
        "grey":   "#bbbbbb",
        "blue":   "#377eb8",
        "purple": "#984ea3",
        "green":  "#4daf4a",
        "orange": "#ff7f00"
    };



      //Width and height
  var margin = {top: 80, right: 50, bottom: 80, left: 70},
      w = 500 - margin.left - margin.right,
      h = 400 - margin.top - margin.bottom
      ;


// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return +d['category']; }
function y(d) { return +d['measure']; }
function radius(d) { return +d['population']; }
function color(d) { return d['Race']; }
function key(d) { return d['Race']; }

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + key(d) + "<br>Population: "+d3.format(",")(Math.floor(radius(d)))+
    "<br>Age: "+d3.format(",")(Math.floor(x(d)))+  "</span>";
  })



// Defines a sort order so that the smallest dots are drawn on top.
function order(a, b) {
  return radius(b) - radius(a);
}

var dataset=firstDdatasetBubbleChart;
// dataset=datasetBubbleChart.filter(function (el) {
//     return (el.group === 'Breast'); });


      
      x_data=dataset.map(function(d) { return +x(d); });
      // console.log(x_data);
      y_data=dataset.map(function(d) { return +y(d); });
      r_data=dataset.map(function(d) { return +radius(d); });
      col_data=dataset.map(function(d) { return +color(d); });

      //console.log(x_data);
      //console.log(dataset);
      //Create scale functions

      var races_names=['White','Black or African American',
'Asian or Pacific Islander','American Indian or Alaska Native'];
var legend_color=d3.scale.category10();
legend_color.domain(races_names);

        var rScale = d3.scale.log()
       .domain([d3.min(r_data),d3.max(r_data)])
       .range([2, 10]);

      // find radius of the most most left and bottom points to shift axis.
      minx_radius=radius(dataset.sort(function(a,b) {return - x(b) + x(a)})[1] ) 
      miny_radius=radius(dataset.sort(function(a,b) {return - y(b) + y(a)})[1] ) 
      // console.log(rScale(miny_radius ) )

      var xScale = d3.scale.linear()
       .domain([d3.min(x_data)-5,d3.max(x_data)+20])
       .range([0, w ]);


      var yScale = d3.scale.linear()
       .domain([d3.min(y_data)-10,d3.max(y_data)])
       .range([h, 0]);




      var colorScale = d3.scale.category10();


      //Define X axis
      xAxis_bubble = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(12, d3.format(",d"));

      //Define Y axis
      yAxis_bubble = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

  //Create SVG element
    var svg = d3.select("#bubbleChart").append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top+ ")")
// Create SVG element (remember use normal CSS style attributes)

svg.style("border-color", colors.grey);
svg.style("border-width", 1);
svg.style("border-style", "solid");

svg.call(tip);

        // Add a dot per nation. Initialize the data at 1800, and set the colors.
      var dot = svg.append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) {
            return xScale( x(d));
      })
      .attr("cy", function(d) {
            return yScale(y(d));
      })
      .style("fill", function(d) { return legend_color(color(d)); })
      .attr("r", function(d) {
            return rScale(radius(d));
      })
      // .attr("data-legend",function(d) { return color(d)})
      .sort(order)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);



      // legend = svg.append("g")
      // .attr("class","legend_bubble ")
      // .attr("transform","translate(50,30)")
      // .style("font-size","12px")
      // .call(d3.legend);


      // Add an x-axis label.
      svg.append("text")
      // .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", w/2+w/5)
      .attr("y", h+h/8+20)
      .text("age group (years)");

      //Add a y-axis label.
      svg.append("text")
      // .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -h/6-30)
      .attr("x", -h/6+25)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Incidence Rate (per 100,00 people)");


      //Create X axis
      svg.append("g")
      .attr("class", "x axis_bubble")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis_bubble);
                  
      //Create Y axis
      svg.append("g")
      .attr("class", "y axis_bubble")
      .call(yAxis_bubble);

      // svg.append("text")
      // .attr("x", (w / 2))             
      // .attr("y", 0 - (-margin.left) -100)
      // .attr("text-anchor", "middle")  
      // .style("font-size", "16px") 
      // .text("The Wealth & Health of US States");


  var legend = svg.selectAll('.legend_line')
  .data(legend_color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend_line')
   .attr('transform', function(d, i) {
    var vert=-70+18*i;
    return 'translate(' + -70+ ',' +  vert + ')';
  });


legend.append('text')
  .attr('x', 0)
  .attr('y', 0)
  .style('fill', legend_color)
   .attr("font-size", "15px")
  // .style('fill', 'grey')
  .text(function(d) { return d; });

      };


function updateBubbleChart(group,Sex) {
  // console.log(group);

  var races_names=['White','Black or African American',
  'Asian or Pacific Islander','American Indian or Alaska Native'];
  var legend_color=d3.scale.category10();
  legend_color.domain(races_names);

   var firstDdatasetBubbleChart = datasetBubbleChartChosen(group,Sex);   
   // console.log(firstDdatasetBubbleChart);

        // ColorBrewer
    var colors = {
        "grey":   "#bbbbbb",
        "blue":   "#377eb8",
        "purple": "#984ea3",
        "green":  "#4daf4a",
        "orange": "#ff7f00"
    };



      //Width and height
  var margin = {top: 80, right: 50, bottom: 80, left: 70},
      w = 500 - margin.left - margin.right,
      h = 400 - margin.top - margin.bottom
      ;


// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return +d['category']; }
function y(d) { return +d['measure']; }
// function radius(d) { if(d['population']>500000){return +d['population'];};
// return 500000;
//  }


function radius(d) { return +d['population'];}
function color(d) { return d['Race']; }
function key(d) { return d['Sex']; }



// Defines a sort order so that the smallest dots are drawn on top.
function order(a, b) {
  return radius(b) - radius(a);
}



// dataset=datasetBubbleChart.filter(function (el) {
//     return (el.group === 'Breast'); });


      var dataset=datasetBubbleChartChosen(group,Sex);

      x_data=dataset.map(function(d) { return +x(d); });
      // console.log(x_data);
      y_data=dataset.map(function(d) { return +y(d); });
      r_data=dataset.map(function(d) { return +radius(d); });
      col_data=dataset.map(function(d) { return +color(d); });

    var plot_max=d3.max(y_data);



      //console.log(x_data);
      //console.log(dataset);
      //Create scale functions

        var rScale = d3.scale.log()
       .domain([d3.min(r_data),d3.max(r_data)])
       .range([3, 13]);

      // find radius of the most most left and bottom points to shift axis.
      minx_radius=radius(dataset.sort(function(a,b) {return - x(b) + x(a)})[1] ) 
      miny_radius=radius(dataset.sort(function(a,b) {return - y(b) + y(a)})[1] ) 

      console.log(d3.min(r_data) )

      var xScale = d3.scale.linear()
       .domain([d3.min(x_data)-5,d3.max(x_data)+20])
       .range([0, w ]);


      var yScale = d3.scale.linear()
       .domain([d3.min(y_data)-10,plot_max])
       .range([h, 0]);

       console.log(d3.max(y_data));


      //Define X axis
      xAxis_bubble.scale(xScale);
      //Define Y axis
      yAxis_bubble.scale(yScale);

  //Create SVG element
    var svg = d3.select("#bubbleChart").selectAll('svg');

// Create SVG element (remember use normal CSS style attributes)





      var circle = d3.selectAll("circle")
      .data(dataset);

circle.enter().append("circle");
 circle.exit().remove();

    circle
      .transition()
    .duration(750)
      .attr("class", "dot")
      .attr("cx", function(d) {
            return xScale( x(d));
      })
      .attr("cy", function(d) {
            return yScale(y(d));
      })
      .style("fill", function(d) { return legend_color(color(d)); })
      .attr("r", function(d) {
            return rScale(radius(d));
      })
      // .attr("data-legend",function(d) { return color(d)})
      .sort(order);

      //   legend = svg.selectAll(".legend_bubble")
      // .attr("transform","translate(50,30)")
      // .style("font-size","12px")
      // .call(d3.legend);


    var t = svg.transition().duration(750);
    t.select(".y.axis_bubble").call(yAxis_bubble);
    t.select(".x.axis_bubble").call(xAxis_bubble)
    ;
  
 


      };

