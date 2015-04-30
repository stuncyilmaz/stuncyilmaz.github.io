/*
############# BAR_large CHART ###################
-------------------------------------------
*/

function dsBAR_large_Chart(data){

   // console.log(data);

    data.sort(function(a,b){return d3.descending(a.measure, b.measure);});

  var   width = 500,
       height = 600;


var color = d3.scale.quantize().domain([data.length,0])
    .range(colorbrewer.RdBu[data.length+1]);

  var margin = {top: 30, right: 20, bottom: 80, left: 90};
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
      .text("Total Counts");





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
        .text("Click on a bar to select a genre");


  function up(d, i) {
  
        /* update bar chart when user selects BAR_large_ce of the BAR_large_ chart */
        //updateBarChart(dataset[i].category);
        // console.log(d);
        updateBarChart(d.category, color(i));
        updateLineChart(d.category, color(i));
        
       
  }


// ##########################################################################################################################
  }


/*
############# BAR CHART ###################
-------------------------------------------
*/





function datasetBarChosen(group) {
  var ds = [];
  for (x in datasetBarChart) {
     if(datasetBarChart[x].group==group){
      ds.push(datasetBarChart[x]);
     } 
    }
  return ds;
}


function dsBarChartBasics() {

    var margin = {top: 30, right: 5, bottom: 20, left: 50},
    width = 500 - margin.left - margin.right,
     height = 250 - margin.top - margin.bottom,
    colorBar = d3.scale.category20(),
    barPadding = 1
    ;
    
    return {
      margin : margin, 
      width : width, 
      height : height, 
      colorBar : colorBar, 
      barPadding : barPadding
    }     
    ;
}

function dsBarChart() {

  var firstDatasetBarChart = datasetBarChosen(group);           
  
  var basics = dsBarChartBasics();
  
  var margin = basics.margin,
    width = basics.width,
     height = basics.height,
    colorBar = basics.colorBar,
    barPadding = basics.barPadding
    ;
          
  var   xScale = d3.scale.linear()
            .domain([0, firstDatasetBarChart.length])
            .range([0, width])
            ;
            
  // Create linear y scale 
  // Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
  // get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
  var yScale = d3.scale.linear()
      // use the max funtion to derive end point of the domain (max value of the dataset)
      // do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
       .domain([0, d3.max(firstDatasetBarChart, function(d) { return d.measure; })])
       // As coordinates are always defined from the top left corner, the y position of the bar
       // is the svg height minus the data value. So you basically draw the bar starting from the top. 
       // To have the y position calculated by the range function
       .range([height, 0])
       ;
  
  //Create SVG element
  
  var svg = d3.select("#barChart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","barChartPlot")
        ;
  
  var plot = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;
              
  plot.selectAll("rect")
       .data(firstDatasetBarChart)
       .enter()
       .append("rect")
      .attr("x", function(d, i) {
          return xScale(i);
      })
       .attr("width", width / firstDatasetBarChart.length - barPadding)   
      .attr("y", function(d) {
          return yScale(d.measure);
      })  
      .attr("height", function(d) {
          return height-yScale(d.measure);
      })
      .attr("fill", "lightgrey")
      ;
  
    
  // Add y labels to plot 
  
  plot.selectAll("text")
  .data(firstDatasetBarChart)
  .enter()
  .append("text")
  .text(function(d) {
      return formatAsInteger(d3.round(d.measure));
  })
  .attr("text-anchor", "middle")
  // Set x position to the left edge of each bar plus half the bar width
  .attr("x", function(d, i) {
      return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
  })
  .attr("y", function(d) {
      return yScale(d.measure) + 14;
  })
  .attr("class", "yAxis")
  /* moved to CSS        
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "white")
  */
  ;
  
  // Add x labels to chart  
  
  var xLabels = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
        ;
  
  xLabels.selectAll("text.xAxis")
      .data(firstDatasetBarChart)
      .enter()
      .append("text")
      .text(function(d) { return d.category;})
      .attr("text-anchor", "middle")
      // Set x position to the left edge of each bar plus half the bar width
               .attr("x", function(d, i) {
                  return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
               })
      .attr("y", 15)
      .attr("class", "xAxis")
      //.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
      ;     
   
  // Title
  
  svg.append("text")
    .attr("x", (width + margin.left + margin.right)/2)
    .attr("y", 15)
    .attr("class","title")        
    .attr("text-anchor", "middle")
    .text("Rating Breakdown Across Rating Sources")
    ;
}


 /* ** UPDATE CHART ** */
 
/* updates bar chart on request */

function updateBarChart(group, colorChosen) {
  
    var currentDatasetBarChart = datasetBarChosen(group);
    
    var basics = dsBarChartBasics();
  
    var margin = basics.margin,
      width = basics.width,
       height = basics.height,
      colorBar = basics.colorBar,
      barPadding = basics.barPadding
      ;
    
    var   xScale = d3.scale.linear()
      .domain([0, currentDatasetBarChart.length])
      .range([0, width])
      ;
    
      
    var yScale = d3.scale.linear()
        .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
        .range([height,0])
        ;
        
     var svg = d3.select("#barChart svg");
        
     var plot = d3.select("#barChartPlot")
      .datum(currentDatasetBarChart)
       ;
  
        /* Note that here we only have to select the elements - no more appending! */
      plot.selectAll("rect")
        .data(currentDatasetBarChart)
        .transition()
      .duration(750)
      .attr("x", function(d, i) {
          return xScale(i);
      })
       .attr("width", width / currentDatasetBarChart.length - barPadding)   
      .attr("y", function(d) {
          return yScale(d.measure);
      })  
      .attr("height", function(d) {
          return height-yScale(d.measure);
      })
      .attr("fill", colorChosen)
      ;
    
    plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
      .data(currentDatasetBarChart)
      .transition()
      .duration(750)
       .attr("text-anchor", "middle")
       .attr("x", function(d, i) {
          return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
       })
       .attr("y", function(d) {
          return yScale(d.measure) + 14;
       })
       .text(function(d) {
        return formatAsInteger(d3.round(d.measure));
       })
       .attr("class", "yAxis")           
    ;
    

    svg.selectAll("text.title") // target the text element(s) which has a title class defined
      .attr("x", (width + margin.left + margin.right)/2)
      .attr("y", 15)
      .attr("class","title")        
      .attr("text-anchor", "middle")
      .text('Rating Breakdown for '+group + " across rating sources")
    ;
}


/*
############# LINE CHART ##################
-------------------------------------------
*/







function datasetLineChartChosen(group) {
  var ds = [];
  for (x in datasetLineChart) {
     if(datasetLineChart[x].group==group){
      ds.push(datasetLineChart[x]);
     } 
    }

  return ds;
}

function dsLineChartBasics() {

  var margin = {top: 40, right: 10, bottom: 20, left: 50},
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

  console.log(group);
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
      .domain([0, d3.max(firstDatasetLineChart, function(d) { return d.measure; })])
      .range([height, 0])
      ;

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var formatxAxis = d3.format("");

  xAxis.tickFormat(formatxAxis).ticks(10);



var yAxis = d3.svg.axis()
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
      .attr("dy", "-2.71em")
      .style("text-anchor", "end")
      .text("Average Rating");
      
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
    .text("Average Over Rating Sources")
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

  var xScale = d3.scale.linear()
      .domain([0, currentDatasetLineChart.length-1])
      .range([0, width])
      ;

  var yScale = d3.scale.linear()
      .domain([0, d3.max(currentDatasetLineChart, function(d) { return d.measure; })])
      .range([height, 0])
      ;
  
  var line = d3.svg.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d.measure); })
    ;

   var plot = d3.select("#lineChartPlot")
    .datum(currentDatasetLineChart)
     ;
     
  /* descriptive titles as part of plot -- start */
  var dsLength=currentDatasetLineChart.length;
  
  // plot.select("text")
  //   .text(currentDatasetLineChart[dsLength-1].measure)
  //   ;
  /* descriptive titles -- end */
     
  plot
  .select("path")
    .transition()
    .duration(750)          
     .attr("class", "line")
     .attr("d", line) 
     // add color
    .attr("stroke", colorChosen)
     ;
     

     
     // path
     // .selectAll("title")
     // .text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })   
     // ;  

}

