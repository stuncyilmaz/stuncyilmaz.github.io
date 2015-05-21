/*
############# BAR_large CHART ###################
-------------------------------------------
*/

function dsBAR_large_Chart(data){

   // console.log(data);
  data=data.filter(function (el) {
      return (el.Sex === "Female"); });
  // console.log(data);
    data.sort(function(a,b){return d3.descending(a.sum_column, b.sum_column);});

  var   width = 500,
       height = 600;


var color = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.category; }))
    .range(colorbrewer.Blues[4]);
var color=d3.scale.category20b();




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
        updateBubbleChart(d.category,d.Sex);
        updateLineChart(d.category,d.Sex, color(i));
        
       
     }
  }

// ##########################################################################################################################




/*
############# LINE CHART ##################
// -------------------------------------------
// */


function datasetLineChartChosen(group,Sex) {
  var ds = [];
  for (x in datasetLineChart) {
     if((datasetLineChart[x].group===group) &&  (datasetLineChart[x].Sex===Sex) ){
      ds.push(datasetLineChart[x]);
     } 
    }
    // console.log(ds)
  return ds;
}

function dsLineChartBasics() {

  var margin = {top: 80, right: 20, bottom: 100, left: 70},
      width = 500 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom
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
  var firstDatasetLineChart = datasetLineChartChosen(group,Sex);    
  
  
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


  xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var formatxAxis = d3.format("");

  xAxis.tickFormat(formatxAxis).ticks(10);



yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

yAxis.tickFormat(formatxAxis).ticks(5);
  

   
// console.log(firstDatasetLineChart );




     
var line = d3.svg.line()
      .x(function(d) { return xScale(d.category); })
      //.x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.measure); })
      ;
   

  var svg = d3.select("#lineChart").append("svg")
      // .datum(firstDatasetLineChart)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
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
      .attr("dy", "-4.71em")
       .attr("dx", "0.0em")
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
  
var races_names=['White','Black or African American',
'Asian or Pacific Islander','American Indian or Alaska Native'];
var races_acronymns=['white','african','asian','native'];

var races_list=[];

for (i = 0; i < races_names.length; i++) { 

  races_list.push({
    key:   races_names[i],
    name:races_acronymns[i],
    value: 
    firstDatasetLineChart.filter(function (el) {
    return (el.Race === races_names[i]); })
});

}
var legend_color=d3.scale.category10();
legend_color.domain(races_names);

for (i = 0; i < races_names.length; i++) { 
        plot.append("path")
      .attr("class", "line")
       .attr("id", races_list[i].name) 
      .attr("d", line(races_list[i].value)) 
      // add color
    .attr("stroke", legend_color(races_names[i]) )
      ;
}






  svg.append("text")
    .text("Incidence Rate for the cancer type: " +group)
    .attr("id","lineChartTitle1") 
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 12)
    ;

        svg.append("text")
      // .attr("class", "x label")
      .attr("text-anchor", "end")
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 350)
      .text("Year");



}




 /* ** UPDATE CHART ** */
 
/* updates bar chart on request */
function updateLineChart(group, Sex,colorChosen) {


  var currentDatasetLineChart = datasetLineChartChosen(group,Sex);  






  var basics = dsLineChartBasics();
  
  var margin = basics.margin,
    width = basics.width,
     height = basics.height
    ;

    var formatxAxis = d3.format("");




  var xScale = d3.scale.linear()
        .domain(d3.extent(currentDatasetLineChart, function(d) { return +d.category; }) ) 
      .range([0, width])
      ;
  var yScale = d3.scale.linear()
      .domain([d3.min(currentDatasetLineChart, function(d) 
        { return d.measure; }), 
      d3.max(currentDatasetLineChart, function(d) { return d.measure; }) ])
      .range([height, 0])
      ;

   var plot = d3.select("#lineChartPlot");

    // .datum(currentDatasetLineChart);
  yAxis.scale(yScale);
  // xAxis.scale(xScale);



  var svg= d3.select("#lineChart").selectAll('svg');


    var t = svg.transition().duration(750);
    t.select(".y.axis_line").call(yAxis);
     // t.select(".x.axis_line").call(xAxis);

  
  var line = d3.svg.line()
    .x(function(d, i) { return xScale(+d.category); })
    .y(function(d) { return yScale(d.measure); })
    ;
// console.log(african);


// console.log(yScale.domain() );




var races_names=['White','Black or African American',
'Asian or Pacific Islander','American Indian or Alaska Native'];
var races_acronymns=['white','african','asian','native'];

var legend_color=d3.scale.category10();
legend_color.domain(races_names);

var races_list=[];

for (i = 0; i < races_names.length; i++) { 

  races_list.push({
    key:   races_names[i],
    name:races_acronymns[i],
    value: 
    currentDatasetLineChart.filter(function (el) {
    return (el.Race === races_names[i]); })
});

}



  for (i = 0; i < races_names.length; i++) {   
  plot
  .select("#"+races_acronymns[i])
    .transition()
    .duration(750)          
     .attr("class", "line")
     .attr("d", line(races_list[i].value)) 
     // add color
    .attr("stroke", legend_color(races_names[i]) )
     ;
  }


var text = svg.select("#lineChartTitle1").text("Incidence Rate for the cancer type: ");

text.append("tspan")
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 31)
    .text(group)
    .attr("fill", colorChosen );

text.append("tspan")
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 51)
    .text(Sex)
    .attr("fill", colorChosen );

  



}

