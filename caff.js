var margin = {top: 20, right: 20, bottom: 30, left: 50};
var w = 750 - margin.left - margin.right;
var h = 400 - margin.top - margin.bottom;

var svg = d3.select("#graph").append("svg")
 	.attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
 	.domain([0, 1000])
  	.range([0, w]);
var xAxis = d3.svg.axis()
  	.scale(x)
  	.orient("bottom");

var y = d3.scale.linear()
  	.domain([0, 1000])
  	.range([h, 0]);
var yAxis = d3.svg.axis()
  	.scale(y)
  	.orient("left");

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
  .append("text")
    .attr("x", w)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Caffeine (milligrams)");
svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy",".71em")
    .style("text-anchor", "end")
    .text("Calories");

// Loading data from CSV: 

var dataset;

// d3.csv("Caffeine.csv", function(error, drinks) {
//     if (error) {
//     	return console.warn(error);
//     }
//     //console.log(stocks);
//     drinks.forEach(function(d) {
//   	    //console.log(d);
//       	d.Caffeine = +d.Caffeine;
//       	d.Calories = +d.Calories;
//     });
//     dataset = drinks;
//     drawVis(dataset);
//   });



// Function for interactivity:

function drawVis(data) {
  	var circles = svg.selectAll("circle")
    	.data(data);
  	circles
    	.attr("cx", function(d) { return x(d.Caffeine);  })
    	.attr("cy", function(d) { return y(d.Calories);  })
    	.style("fill", "red" /*function(d) {return col(d.vol);}*/);	// Determines color
  	circles.exit().remove();

 	circles.enter().append("circle")
	    .attr("cx", function(d) { return x(d.Caffeine);  })
	    .attr("cy", function(d) { return y(d.Calories);  })
	    .attr("r", 4)
	    .style("fill", "red" /*function(d) {return col(d.vol);}*/)	// Determines color
	    .style("opacity", 0.5)
	    .style("stroke", "black");
  	circles 
  	.on("mouseover", function(d,i) {
    	d3.select(this).attr("r",8);
    	tooltip.transition()
      	.duration(200)
      	.style("opacity", 1);
    	tooltip.html("Item <b>"+d.Coffee+"</b>:<br>Calories: "+d.Calories+"<br>Caffeine: "+d.Caffeine) // This will need more info later
      		.style("left", (d3.event.pageX + 5)+"px")
      		.style("top", (d3.event.pageY -28) +"px");
  })
  	.on("mouseout", function(d,i) {
    	d3.select(this).attr("r",4);
    	tooltip.transition()
      		.duration(500)
      		.style("opacity", 0)
      		.style("border-style", "solid");
  });
}










