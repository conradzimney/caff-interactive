var margin = {top: 20, right: 20, bottom: 30, left: 50};
var w = 750 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;

var tooltipX = 778;
var tooltipY = 79;

var col = d3.scale.category10();


var svg = d3.select("body").append("svg")
 	.attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
 	.domain([0, 350])
  	.range([0, w]);
var xAxis = d3.svg.axis()
  	.scale(x)
  	.orient("bottom");

var y = d3.scale.linear()
  	.domain([0, 800])
  	.range([h, 0]);
var yAxis = d3.svg.axis()
  	.scale(y)
  	.orient("left");

var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
  	.style("opactiy", 0);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
  .append("text")
    .attr("x", w/2)
    .attr("y", 28)
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

d3.csv("Caffeine.csv", function(error, drinks) {
    if (error) {
    	return console.warn(error);
    }
    //console.log(stocks);
    drinks.forEach(function(d) {
  	    //console.log(d);
      	d.Caffeine = +d.Caffeine;
      	d.Calories = +d.Calories;
    });
    dataset = drinks;
    drawVis(dataset);
  });



// Function for interactivity:

function drawVis(data) {
  	var circles = svg.selectAll("circle")
    	.data(data);
  	circles
    	.attr("cx", function(d) { return x(d.Caffeine);  })
    	.attr("cy", function(d) { return y(d.Calories);  })
    	.style("fill", function(d) {return col(d.Type);});	// Determines color
  	circles.exit().remove();

 	circles.enter().append("circle")
	    .attr("cx", function(d) { return x(d.Caffeine);  })
	    .attr("cy", function(d) { return y(d.Calories);  })
	    .attr("r", 4)
	    .style("fill", function(d) {return col(d.Type);})	// Determines color
	    .style("opacity", 0.75)
	    .style("stroke", "black");
  	circles 
  	.on("mouseover", function(d,i) {
    	d3.select(this).attr("r",8);
    	tooltip.transition()
      	.duration(200)
      	.style("opacity", 1);
    	tooltip.html("<b>"+d.Coffee+"</b><br>Calories: "+d.Calories+"<br>Caffeine: "+d.Caffeine) // This will need more info later
      		.style("left", tooltipX+"px")
      		.style("top", tooltipY+"px");
  })
  	.on("mouseout", function(d,i) {
    	d3.select(this).attr("r",4);
    	tooltip.transition()
      		.duration(500)
      		.style("opacity", 0)
  });
}

var mytype ="all";
var patt = new RegExp("all");

$("#myselectform").onchange = function() {
    filterType(this.value);
}

function filterType(myType) {
  mytype = myType;
  var res = patt.test(mytype);
  if(res){
    var toVisualize = dataset;
  } else {
    var toVisualize = dataset.filter(function(d,i) {
      return d["type"] == mytype;
    });
  }
drawVis(toVisualize);
}

function filterData(attr, values){
  for (i = 0; i < attributes.length; i++){
    if (attr == attributes[i]){
      ranges[i] = values;
    }
  }
  var res = patt.test(mytype);
  if(res){
    var toVisualize = dataset.filter(function(d) { 
    return d[attr] >= values[0] && d[attr] <= values[1];
    //return isInRange(d)
    }); 
  }else{
    var toVisualize = dataset.filter(function(d) { 
    return d[attr] >= values[0] && d[attr] <= values[1] && d["type"]==mytype;
  });
  }
  drawVis(toVisualize);
}






