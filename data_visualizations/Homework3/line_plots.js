function line_func(svgid,holderid,height,width) {


  var svg = d3.select("svg#" + svgid);

    if (svg.empty()) {
        console.warn("Unable to find SVG:", svgid);
        return;
    }

    d3.select("svg#" + svgid).selectAll("*").remove();

var margin = {top: 20, right: 130, bottom: 30, left: 50},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m").parse;
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    //.interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.plot_val); });

var svg = d3.selectAll("#"+holderid).select("svg")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("drivers.csv", function(error, data) {

  color.domain(d3.keys(data[0]).filter(function(key) { return ( ['drivers','front-seat passengers','rear-seat passengers'].indexOf(key)!=-1  ); }));
  // console.log(data)

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });
  //console.log(data[1])

  var person_type = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, plot_val: +d[name],law: +d['law']};
      })
    };
  });

  var after_law=person_type.map(
    function(xx){
      return xx.values.filter(function(d){
        return d.law!='0'
      })
  });
  console.log(person_type[0])

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(person_type, function(c) { return d3.min(c.values, function(v) { return v.plot_val; }); }),
    d3.max(person_type, function(c) { return d3.max(c.values, function(v) { return v.plot_val; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("number of people (per month)");

  var all_people = svg.selectAll(".person_type")
      .data(person_type);

    all_people.enter().append("g")
      .attr("class", "person_type");



    all_people.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); } );


 var law_date=parseDate('198302');
 console.log(law_date)

// law starts
 law_line=svg.append("line")
  .attr("x1", x(law_date))  //<<== change your code here
  .attr("y1", 0)
  .attr("x2", x(law_date))  //<<== and here
  .attr("y2", height)
  .style("stroke-width", 2)
  .style("stroke", "grey")
  .style("fill", "none");


svg.append("text")
    .attr("transform", "translate("+x(law_date)+"," + 0 + ")")
    .attr("x", 5)
    .attr("dy", ".35em")
    .style("font-size", "14px") 
    .text('seat belt law in effect');



  all_people.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.plot_val) + ")"; })
      .attr("x", -8)
      .attr("dy", "-5")
      .style("font-size", "14px") 
      .text(function(d) { return d.name; });



  svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top /3))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .text("People killed or seriously injured by car accidents in UK");


  var focus1 = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus1.append("circle")
      .attr("r", 4.5);

  focus1.append("text")
      .attr("x", 9)
      .attr("dy", ".1em");

var focus2 = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus2.append("circle")
      .attr("r", 4.5);

  focus2.append("text")
      .attr("x", 9)
      .attr("dy", ".1em");

var focus3 = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus3.append("circle")
      .attr("r", 4.5);

  focus3.append("text")
      .attr("x", 9)
      .attr("dy", ".1em");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus1.style("display", null); focus2.style("display", null); focus3.style("display", null); })
      .on("mouseout", function() { focus1.style("display", "none");focus2.style("display", "none"); focus3.style("display", "none"); })
      .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus1.attr("transform", "translate(" + x(d.date) + "," + y(d[color.domain()[0]]) + ")");
    focus1.select("text").text(d[color.domain()[0]]);

    focus2.attr("transform", "translate(" + x(d.date) + "," + y(d[color.domain()[1]]) + ")");
    focus2.select("text").text(d[color.domain()[1]]);

    focus3.attr("transform", "translate(" + x(d.date) + "," + y(d[color.domain()[2]]) + ")");
    focus3.select("text").text(d[color.domain()[2]]);

  }
  console.log(color.domain()[0])

});

}


