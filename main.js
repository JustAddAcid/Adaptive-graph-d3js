var nodes = [
    {
        number: 1,
        x: 3.0,
        y: 5.5,
        value: "A"
    },
    {
        number: 2,
        x: 10.0,
        y: 7.0,
        value: "B"
    },
    {
        number: 3,
        x: 8.0,
        y: 2.0,
        value: "C"
    },
    {
        number: 4,
        x: 2.0,
        y: 3.0,
        value: "D"
    }
];
var lines = [
    {
        numberFrom : 1,
        numberTo : 2
    },
    {
        numberFrom : 3,
        numberTo : 2
    },
    {
        numberFrom : 1,
        numberTo : 3
    },
    {
        numberFrom : 4,
        numberTo : 1
    },
    {
        numberFrom : 4,
        numberTo : 2
    },
    {
        numberFrom : 4,
        numberTo : 3
    }
]; // Явно объявляем данные. Чтобы не поднимать лишний раз сервер для ajax запросов


// Вычисляем минимальные и максимальные координаты, чтобы не было пустых пространств на экране
var minX, minY, maxX, maxY;
(function getMaxMinCoords(){
    minX = nodes[0].x;
    minY = nodes[0].y;
    maxX = nodes[0].x;
    maxY = nodes[0].y;
    for (let i = 1; i < nodes.length; i ++){
        if (nodes[i].x < minX)
            minX = nodes[i].x;
        if (nodes[i].x > maxX)
            maxX = nodes[i].x;
        if (nodes[i].y > maxY)
            maxY = nodes[i].y
        if (nodes[i].y < minY)
            minY = nodes[i].y;
    }
})()

function draw(){
    var coords = {};
    var width = window.innerWidth - 200; // margin 100px с каждой стороны
    var height = window.innerHeight - 200;
    
    var circleRadius = Math.min(height, width) * 0.06; 
    var calcY = d3.scaleLinear()
        .domain([minY, maxY])
        .range([ height - circleRadius, circleRadius ]);

    var calcX = d3.scaleLinear()
        .domain([minX, maxX])
        .range([ circleRadius , width - circleRadius ]);        

    for ( let node of nodes ){ // Вычисляем отмасштабированные координаты
        coords[node.number] = {
            x : calcX(node.x),
            y : calcY(node.y)
        }
    }
    
    var arrow = d3.select("#arrow")
        .attr("refX", 9 + circleRadius * 0.5);
    var svgLines = d3.select("svg")
        .selectAll("line")
        .data(lines);
    svgLines
        .enter()
        .append("line")
        .merge(svgLines)
        .attr("x1", d => coords[d.numberFrom].x)
        .attr("x2", d => coords[d.numberTo].x)
        .attr("y1", d => coords[d.numberFrom].y)
        .attr("y2", d => coords[d.numberTo].y)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("marker-end","url(#arrow)");

    var nodesUpdate = d3.select("svg")
        .selectAll(".node")
        .data(nodes);

    var nodesEnter = nodesUpdate.enter()
        .append("g")
        .attr("class","node");

    nodesEnter.append("circle")
        .attr("fill", 'yellow');
    nodesEnter.append("text")
        .text(d => d.value);

    var nodesEnterUpdate = nodesEnter.merge(nodesUpdate);
    nodesEnterUpdate.select('text')
        .attr("dx", d => coords[d.number].x - 5)
        .attr("dy", d => coords[d.number].y + 5)
    nodesEnterUpdate.select('circle')
        .attr("cx", d => coords[d.number].x)
        .attr("cy", d => coords[d.number].y)
        .attr("r", circleRadius)
}
draw();
window.addEventListener("resize", draw);