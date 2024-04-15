import http from 'http';
import QRCode from 'qrcode';

const PORT = 3000;

let QR_CODE_HISTORY = [];

const server = http.createServer((request, response) => {
    const { url, method } = request;
    let body = '';

    request.on('data', (chunk) => {
        body += chunk;
    })

    request.on('end', () => {
        let data;
        if (body) {
            data = JSON.parse(body);
        }
        if (url === '/') {
            response.statusCode = 200;
            response.end('Health check');
        } else if (url === '/generate' && method === 'POST') {
            QRCode.toDataURL(data.code, (error, url) => {
                QR_CODE_HISTORY.push({ url, name: data?.name });

                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(`
                <div>
                    <h3>Skenirajte QR code za ${data.name}:</h3>
                    <img src=${url} />
                </div>
                <h2>Historija:</h2>
                <div>
                    ${QR_CODE_HISTORY.map((code) =>
                    `<div style="display:flex;">
                        <div>
                           <img src=${code.url} />
                           <h5>${code.name}</h5>
                        </div>
                    </div`
                )}
                </div>
                `);

                response.end();
            });
        }
    })
});

server.listen(PORT, 'localhost', () => {
    console.log(`Server is running on port: ${PORT}`);
    // console.log('server je pokrenut');
});