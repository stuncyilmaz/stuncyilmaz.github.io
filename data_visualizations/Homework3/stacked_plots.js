
function stacked_func(svgid,holderid,height,width) {


  var svg = d3.select("svg#" + svgid);

    if (svg.empty()) {
        console.warn("Unable to find SVG:", svgid);
        return;
    }

    d3.select("svg#" + svgid).selectAll("*").remove();

d3.csv("drivers_scaled.csv", function(error, data) {

  genStackedPlot(data,svgid,holderid,height,width);

});

function genStackedPlot(data,svgid,holderid,height,width){

var margin = {top: 40, right: 50, bottom: 30, left: 65},
    width = width - margin.left - margin.right,
    height = height- margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m").parse,
    formatPercent = d3.format(".00%");






var x = d3.time.scale()
    .range([0, 3*width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; });


var zoom = d3.behavior.zoom()
        .scaleExtent([1, 1])
        .on("zoom", function () {
            var delta_x=d3.event.translate[0];
            delta_x=Math.min(0, delta_x);
            delta_x=Math.max(-2*width+margin.left, delta_x);
            svg.select(".x.axis").attr("transform", "translate(" +delta_x+","+(height)+")")
            //svg.select(".lines").call(xAxis);
            svg.selectAll(".browser").selectAll(".area")
               .attr("transform", "translate(" + delta_x+","+0+")")
            svg.selectAll(".law")
               .attr("transform", "translate(" + delta_x+","+0+")");

        });


var svg = d3.selectAll("#"+holderid).select("svg")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);


  


  color.domain(d3.keys(data[0]).filter(function(key) { return ( ['drivers','front-seat passengers','rear-seat passengers'].indexOf(key)!=-1  ); }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
    //console.log(d.date)
  });

  var browsers = stack(color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, y: d[name] / 100};
      })
    };
  }));
  //console.log(browsers)

  x.domain(d3.extent(data, function(d) { return d.date; }));


  var browser = svg.selectAll(".browser")
      .data(browsers)
    .enter().append("g")
      .attr("class", "browser");

  browser.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d) { return color(d.name); })
      .style('opacity', 0.8);

  browser.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
      .attr("x", -2.8*width)
      .attr("dy", ".35em")
       .style("font-size", "14px") 
      .text(function(d) { return d.name; });

      svg.selectAll(".browser")
               .attr("transform", "translate(" + (0)+","+0+")")

 var law_date=parseDate('198302');
 console.log(law_date)

// law starts
var law_section=svg.append('g').attr("class", "law")
 law_line=law_section.append("line")
  .attr("x1", x(law_date))  //<<== change your code here
  .attr("y1", 0)
  .attr("x2", x(law_date))  //<<== and here
  .attr("y2", height)
  .style("stroke-width", 2)
  .style("stroke", "grey")
  .style('opacity',1)
  .style("fill", "none");


law_section.append("text")
    .attr("transform", "translate("+x(law_date)+"," + 100 + ")")
    .attr("dx", "-180")
    .attr("dy", ".35em")
    .style("font-size", "14px") 
    .style("fill", "grey") 
    .text('seat belt law in effect');

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-4em")
      .attr("dx", "-2em")
      .style("text-anchor", "end")
      .style("font-size", "14px") 
      .text("fraction of people (per month)");


  svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top /3))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .text("People killed or seriously injured by car accidents in UK");      

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  }

}