// Room data for the graphs
const roomData = [
    { room: 'Living Room', adjacentRooms: ['Kitchen', 'Bedroom', 'Bathroom'] },
    { room: 'Kitchen', adjacentRooms: ['Living Room', 'Dining Room'] },
    { room: 'Bedroom', adjacentRooms: ['Living Room'] },
    { room: 'Dining Room', adjacentRooms: ['Kitchen',] },
    { room: 'Bathroom', adjacentRooms: ['Living Room'] },
    { room: 'Office', adjacentRooms: ['Living Room'] },
    { room: 'Garage', adjacentRooms: ['Kitchen'] },
];

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateLinks(data) {
    const links = [];
    data.forEach(source => {
        source.adjacentRooms.forEach(target => {
            links.push({ source: source.room, target });
        });
    });
    return links;
}

function updateGraph(graphContainer, graphData) {
    const svg = graphContainer.append('svg')
        .attr('width', graphContainer.node().clientWidth)
        .attr('height', graphContainer.node().clientHeight);

    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.room))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(svg.attr('width') / 2, svg.attr('height') / 2));

    const container = svg.append('g');

    const links = generateLinks(graphData);
    const nodes = Array.from(new Set(graphData.map(d => d.room)))
        .map(room => ({ room, color: getRandomColor() }));

    const link = container.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .style('stroke', 'black');

    const node = container.selectAll('.node')
        .data(nodes)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', 10)
        .attr('fill', d => d.color)
        .call(d3.drag()
            .on('start', dragStart)
            .on('drag', dragging)
            .on('end', dragEnd));

    const labels = container.selectAll('.label')
        .data(nodes)
        .enter().append('text')
        .attr('class', 'label')
        .attr('dy', -15)
        .attr('text-anchor', 'middle')
        .text(d => d.room);

    simulation.nodes(nodes);
    simulation.force('link').links(links);

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        labels
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });

    // const zoom = d3.zoom()
    //     .scaleExtent([0.1, 10])
    //     .on('zoom', zoomed);
    //
    // svg.call(zoom);

    // function zoomed(event) {
    //     container.attr('transform', event.transform);
    // }

    function dragStart(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragging(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnd(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}
const graphContainers = d3.selectAll('.graph-container');

graphContainers.each(function(_, i) {
    const graphContainer = d3.select(this);
    const graphData = roomData; // You can implement your own data generation logic here
    updateGraph(graphContainer, graphData);
});

function generateRandomRoomData() {
    const roomNames = ['Living Room', 'Kitchen', 'Bedroom', 'Dining Room', 'Bathroom', 'Office', 'Garage'];

    const getRandomAdjacentRooms = () => {
        const numAdjacent = Math.min(1, Math.floor(Math.random() * (roomNames.length - 1)) + 1);
        const shuffledNames = roomNames.slice().sort(() => 0.5 - Math.random());
        return shuffledNames.slice(0, numAdjacent);
    };

    const newRoomData = roomNames.map(roomName => {
        const adjacentRooms = getRandomAdjacentRooms();
        return {
            room: roomName,
            adjacentRooms: adjacentRooms.filter(adjRoom => adjRoom !== roomName) // Exclude the room itself
        };
    });

    return newRoomData;
}
const regenerateButton = d3.select('#regenerateButton');

regenerateButton.on('click', function() {
    graphContainers.selectAll('svg').remove(); // Clear existing graphs

    graphContainers.each(function(_, i) {
        const graphContainer = d3.select(this);

        const newRoomData = generateRandomRoomData();
        updateGraph(graphContainer, newRoomData);
    });
});
