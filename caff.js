var margin = {top: 20, right: 20, bottom: 60, left: 50};
var w = 750 - margin.left - margin.right;
var h = 684 - margin.top - margin.bottom;

var svg = d3.select("#graph").append("svg")
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

var tooltip = d3.select("tooltip").append("div")
	.attr("class", "tooltip")
  	.style("opactiy", 0);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
  .append("text")
    .attr("x", w/2+14)
    .attr("y", 34)
    .style("text-anchor", "end")
    .style("font-size", "14px")
    .text("Caffeine (milligrams)");
svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "translate(55,0)")
    .attr("y", 6)
    .attr("dy",".71em")
    .style("text-anchor", "end")
    .style("font-size", "14px")
    .text("Calories");

// Loading data from CSV: 

var dataset;

d3.csv("Caffeine.csv", function(error, drinks) {
    if (error) {
    	return console.warn(error);
    }
    drinks.forEach(function(d) {
      	d.Caffeine = +d.Caffeine;
      	d.Calories = +d.Calories;
      	if (d["Type"] == "Coffee") {
      		d.color = "#843c39";
      	} else if (d["Type"] == "Espresso") {
      		d.color = "#8c6d31"
      	} else if (d["Type"] == "Espresso with Milk") {
      		d.color = "#e7ba52"
      	} else if (d["Type"] == "Tea") {
      		d.color = "#b5cf6b"
      	} else if (d["Type"] == "Tea Latte") {
      		d.color = "#637939"
      	} else if (d["Type"] == "Steamed Drink") {
      		d.color = "#9c9ede"
      	} else if (d["Type"] == "Frappuccino") {
      		d.color = "#393b79"
      	} else if (d["Type"] == "Soda") {
      		d.color = "#de9ed6"
      	} else if (d["Type"] == "Food") {
      		d.color = "#843c39"
      	} else if (d["Type"] == "Energy Drink") {
      		d.color = "#7b4173"
      	} else if (d["Type"] == "Pain Reliever") {
      		d.color = "#e7969c"
      	}
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
    	.style("fill", function(d) {return d.color;});	// Determines color
  	circles.exit().remove();

 	circles.enter().append("circle")
	    .attr("cx", function(d) { return x(d.Caffeine);  })
	    .attr("cy", function(d) { return y(d.Calories);  })
	    .attr("r", 5)
	    .style("fill", function(d) {return d.color;})	// Determines color
	    .style("opacity", 0.75)
	    .style("stroke", "black");
  	circles 
  	.on("mouseover", function(d,i) {
    	d3.select(this).attr("r", 9);
    	tooltip.transition()
      	.duration(400)
      	.style("opacity", 1);
    	tooltip.html("<b>"+d.Coffee+"</b><br>Calories: "+d.Calories+"<br>Caffeine: "+d.Caffeine+"<br>Type: "+d.Type);
  })
  	.on("mouseout", function(d,i) {
    	d3.select(this).attr("r",5);
    	tooltip.transition()
      		.duration(800)
      		.style("opacity", 0);
  });
}

var mytype ="All";
var patt = new RegExp("All");

document.getElementById("myselectform").onchange = function() {
    filterType(this.value);
}

function filterType(myType) {
  	mytype = myType;
  	var res = patt.test(mytype);
  	if(res){
    	var toVisualize = dataset;
  	} else {
    	var toVisualize = dataset.filter(function(d,i) {
      		return d["Type"] == mytype;
    	});
  	}
	drawVis(toVisualize);
	resetCaffSlider();
	resetCalSlider();
}

var attributes = ["Caffeine", "Calories"];
var ranges = [[0,340],[0,700]];
var maxCaff = 340;
var maxCal = 700;
var dataguys;

$(function() {
    $("#caff").slider({
        range: true,
      	min: 0,
      	max: maxCaff,
      	values: [0, maxCaff],
      	slide: function(event, ui) {
        	$("#caffamount").val( ui.values[0] + " - " + ui.values[1]);
        	filterData("Caffeine", ui.values);
      	}
    });
    $("#caffamount").val( $("#caff").slider("values", 0) + " - " + $("#caff").slider("values", 1));
});

$(function() {
    $("#cal").slider({
        range: true,
      	min: 0,
      	max: maxCal,
      	values: [0, maxCal],
      	slide: function(event, ui) {
        	$("#calamount").val( ui.values[0] + " - " + ui.values[1]);
        	filterData("Calories", ui.values);
      	}
    });
    $("#calamount").val( $("#cal").slider("values", 0) + " - " + $("#cal").slider("values", 1));
});

function filterData(attr, values){
	for (i = 0; i < attributes.length; i++){
    	if (attr == attributes[i]){
      		ranges[i] = values;
    	} 
  	}
  	var res = patt.test(mytype);
  	if(res){
    	var toVisualize = dataset.filter(function(d) { 
    		return (d["Caffeine"] >= ranges[0][0] && d["Caffeine"] <= ranges[0][1]) && (d["Calories"] >= ranges[1][0] && d["Calories"] <= ranges[1][1]);
    		//return isInRange(d)
    	}); 
  	} else {
    	var toVisualize = dataset.filter(function(d) { 
    		return (d["Caffeine"] >= ranges[0][0] && d["Caffeine"] <= ranges[0][1]) && (d["Calories"] >= ranges[1][0] && d["Calories"] <= ranges[1][1]) && d["Type"]== mytype;
  		});
  	}
  	drawVis(toVisualize);
}

function resetCaffSlider() {
  var $slider = $("#caff");
  $slider.slider("values", 0, 0);
  $slider.slider("values", 1, 340);
}

function resetCalSlider() {
  var $slider = $("#cal");
  $slider.slider("values", 0, 0);
  $slider.slider("values", 1, 700);
}


