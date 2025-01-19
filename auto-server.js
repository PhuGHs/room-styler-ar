const qrcode = require('qrcode-terminal');
const os = require('os');
const path = require('path');

function getLocalIP() {
    const networkInterfaces = os.networkInterfaces();
    let localIP = '';

    // First try to find Wi-Fi interface
    if (networkInterfaces['Wi-Fi']) {
        const wifiInterface = networkInterfaces['Wi-Fi'].find(
            iface => iface.family === 'IPv4' && !iface.internal
        );
        if (wifiInterface) {
            return wifiInterface.address;
        }
    }

    // If Wi-Fi not found, try common wireless interface names
    const wirelessNames = ['Wi-Fi', 'WiFi', 'WLAN', 'wlan0', 'Wireless Network Connection'];

    for (const name of wirelessNames) {
        if (networkInterfaces[name]) {
            const wireless = networkInterfaces[name].find(
                iface => iface.family === 'IPv4' && !iface.internal
            );
            if (wireless) {
                return wireless.address;
            }
        }
    }

    // Fallback: find any non-internal IPv4 address
    for (const interfaceInfos of Object.values(networkInterfaces)) {
        if (!interfaceInfos) continue;

        for (const iface of interfaceInfos) {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIP = iface.address;
                break;
            }
        }
        if (localIP) break;
    }

    return localIP;
}

// Generate QR code
function generateQR(url) {
    return new Promise((resolve) => {
        qrcode.generate(url, { small: true }, (qrOutput) => {
            resolve(qrOutput);
        });
    });
}

async function main() {
    try {
        const localIP = getLocalIP();

        if (!localIP) {
            throw new Error('Unable to determine local IP address.');
        }

        console.log('\nDetected IP:', localIP);
        const url = `https://${localIP}:4200/ar`;
        console.log('Server URL:', url);

        const qrOutput = await generateQR(url);
        console.log('\nScan this QR code to access the application:');
        console.log(qrOutput);

        // Execute ng serve with the detected IP
        const { spawn } = require('child_process');

        // Use local ng CLI from node_modules
        const ngPath = path.join(process.cwd(), 'node_modules', '.bin', 'ng');

        const ngServe = spawn(ngPath, [
            'serve',
            '--ssl', 'true',
            '--ssl-key', './ssl/cert.key',
            '--ssl-cert', './ssl/cert.crt',
            '--host', localIP
        ], {
            stdio: 'inherit',
            shell: true
        });

        ngServe.on('error', (err) => {
            console.error('Failed to start ng serve:', err);
        });

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
