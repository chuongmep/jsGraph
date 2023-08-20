const roomData = [
    { room: 'Living Room', adjacentRooms: ['Kitchen', 'Bedroom', 'Bathroom'] }, // Include Bathroom as an adjacent room
    { room: 'Kitchen', adjacentRooms: ['Living Room', 'Dining Room'] },
    { room: 'Bedroom', adjacentRooms: ['Living Room'] },
    { room: 'Dining Room', adjacentRooms: ['Kitchen'] },
    { room: 'Bathroom', adjacentRooms: ['Living Room'] } // Connect Bathroom to Living Room
];

const links = [];
roomData.forEach(source => {
    source.adjacentRooms.forEach(target => {
        links.push({ source: source.room, target });
    });
});

const nodes = Array.from(new Set(roomData.map(d => d.room)))
    .map(room => ({ room, color: getRandomColor() }));

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const width = 800;
const height = 600;

const svg = d3.select('#graph')
    .attr('width', width)
    .attr('height', height);

const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.room))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2));

const link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');

const node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', 10)
    .attr('fill', d => d.color)
    .call(d3.drag()
        .on('start', dragStart)
        .on('drag', dragging)
        .on('end', dragEnd));

const labels = svg.selectAll('.label')
    .data(nodes)
    .enter().append('text')
    .attr('class', 'label')
    .attr('dy', -15)
    .attr('text-anchor', 'middle')
    .text(d => d.room);

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