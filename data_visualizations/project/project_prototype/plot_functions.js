/*
############# BAR_large CHART ###################
-------------------------------------------
*/

function dsBAR_large_Chart(data){

   // console.log(data);

    data.sort(function(a,b){return d3.descending(a.measure, b.measure);});

  var   width = 500,
       height = 600;


// var color = d3.scale.quantize().domain([data.length,0])
//     .range(colorbrewer.RdBu[data.length+1]);
var color = d3.scale.category20();

  var margin = {top: 30, right: 20, bottom: 200, left: 90};
    var svg = d3.select("#BAR_large_Chart")
       .append("svg")              //create the SVG element inside the <body>
       .data([data])                   //associate our data with the document
           .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
           .attr("height", height)
          .append("g")                //make a group to hold our BAR_large_ chart
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
    var   width = width  - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(data.length+1);

    var formatxAxis = d3.format(",");


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatxAxis)
        .ticks(5);




      x.domain(data.map(function(d) { return d.category; }));
      y.domain([0, d3.max(data, function(d) { 
        // console.log(d.measure);
        return d.measure; 
      })]);

      var gx=svg.append("g")
          .attr("class", "x axis")
          .style("fill","black")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            .style("font-size",12)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-90)" 
                });


     var gy = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

    gy.append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "-5.0em")
      .attr("dx", "-"+height/3)
      .style("text-anchor", "end") .style("font-size",15)
      .text("Total Incidences");





    var rect=svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
    .attr("fill", function(d, i) { return color(i); } ) 
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.category); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.measure); })
      .attr("height", function(d) { return height - y(d.measure); });

    rect.on("click", up);




    svg.append("text")
        .attr("x", (width / 5))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Click on a bar to select a major cancer type");


  function up(d, i) {
  
        /* update bar chart when user selects BAR_large_ce of the BAR_large_ chart */
        //updateBarChart(dataset[i].category);
        // console.log(d);
        // updateBarChart(d.category, color(i));
        updateLineChart(d.category, color(i));
        
       
     }
  }

// ##########################################################################################################################




/*
############# LINE CHART ##################
// -------------------------------------------
// */


function datasetLineChartChosen(group) {
  var ds = [];
  for (x in datasetLineChart) {
     if(datasetLineChart[x].group==group ){
      ds.push(datasetLineChart[x]);
     } 
    }
    // console.log(ds)
  return ds;
}

function dsLineChartBasics() {

  var margin = {top: 40, right: 30, bottom: 40, left: 90},
      width = 500 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom
      ;
    
    return {
      margin : margin, 
      width : width, 
      height : height
    }     
    ;
}


function dsLineChart() {

  // console.log(group);
  var firstDatasetLineChart = datasetLineChartChosen(group);    
  
  
  var basics = dsLineChartBasics();
  
  var margin = basics.margin,
    width = basics.width,
     height = basics.height
    ;

  var xScale = d3.scale.linear()
        .domain(d3.extent(firstDatasetLineChart, function(d) { return +d.category; }) ) 
      .range([0, width])
      ;

  var yScale = d3.scale.linear()
      .domain([d3.min(firstDatasetLineChart, function(d) { return d.measure; }) , d3.max(firstDatasetLineChart, function(d) { return d.measure; })  ])
      .range([height, 0])
      ;


  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var formatxAxis = d3.format("");

  xAxis.tickFormat(formatxAxis).ticks(10);



yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

yAxis.tickFormat(formatxAxis).ticks(5);
  


  var line = d3.svg.line()
      .x(function(d) { return xScale(d.category); })
      //.x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.measure); })
      ;
  
  var svg = d3.select("#lineChart").append("svg")
      .datum(firstDatasetLineChart)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // create group and move it so that margins are respected (space for axis and title)

  svg.append("g")
      .attr("class", "x axis_line")
      .attr("transform", "translate(" + margin.left + "," + (height +margin.top) + ")")
      .call(xAxis)
      .selectAll("text") 
      .style("font-size",12);



  gy=svg.append("g")
      .attr("class", "y axis_line")
      .attr("transform", "translate(" + margin.left + "," + margin.top+ ")")
      .call(yAxis);

    gy.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-5.71em")
       .attr("dx", "3.0em")
      .style("text-anchor", "end")
      .text("Incidence Rate (per 100,00 people)");
      
  var plot = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", "lineChartPlot")
      ;


    /* descriptive titles as part of plot -- start */
  var dsLength=firstDatasetLineChart.length;

  // plot.append("text")
  //   .text(firstDatasetLineChart[dsLength-1].measure)
  //   .attr("id","lineChartTitle2")
  //   .attr("x",width/2)
  //   .attr("y",height/2) 
  //   ;
  /* descriptive titles -- end */
      
  plot.append("path")
      .attr("class", "line")
      .attr("d", line)  
      // add color
    .attr("stroke", "lightgrey")
      ;
    


  svg.append("text")
    .text("Incidence Rate for African-American Population")
    .attr("id","lineChartTitle1") 
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 11)
    ;

    


}




 /* ** UPDATE CHART ** */
 
/* updates bar chart on request */
function updateLineChart(group, colorChosen) {


  var currentDatasetLineChart = datasetLineChartChosen(group);  


  var basics = dsLineChartBasics();
  
  var margin = basics.margin,
    width = basics.width,
     height = basics.height
    ;

    var formatxAxis = d3.format("");




  var xScale = d3.scale.linear()
      .domain([0, currentDatasetLineChart.length-1])
      .range([0, width])
      ;

  var yScale = d3.scale.linear()
      .domain([d3.min(currentDatasetLineChart, function(d) { return d.measure; }), d3.max(currentDatasetLineChart, function(d) { return d.measure; }) ])
      .range([height, 0])
      ;

   var plot = d3.select("#lineChartPlot")
    .datum(currentDatasetLineChart);
  yAxis.scale(yScale);



     var svg= d3.select("#lineChart").selectAll('svg');


          var t = svg.transition().duration(750);
    t.select(".y.axis_line").call(yAxis);

  
  var line = d3.svg.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d.measure); })
    ;



console.log(yScale.domain() );
      

     
  plot
  .select("path")
    .transition()
    .duration(750)          
     .attr("class", "line")
     .attr("d", line) 
     // add color
    .attr("stroke", colorChosen)
     ;



}

