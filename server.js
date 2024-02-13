const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('products.json', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Unable to read products.json');
            } else {
                const products = JSON.parse(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(products));
            }
        });
    } else if (req.url.startsWith('/?category=')) {
        const category = req.url.split('=')[1];
        fs.readFile('products.json', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Unable to read products.json');
            } else {
                const products = JSON.parse(data);
                const filteredProducts = products.filter(product => product.category === category);
                if (filteredProducts.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('No products found for category: ' + category);
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(filteredProducts));
                }
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Endpoint not found');
    }
});

server.on('listening', () => {
    console.log(`Server started on port ${port}`);
});

server.on('error', (err) => {
    console.error(`Unable to start server: ${err}`);
});

server.listen(port);