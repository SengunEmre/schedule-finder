import fs from 'fs';
import path from 'path';

// Function to get the port name by port code
export default async function getPortNameByCode(portCode) {
    try {
        const filePath = path.resolve('./port-code-name.json'); // portsexport.json file
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const ports = JSON.parse(data);
        const port = ports.find(p => p.port_code === portCode);
        if (port) {
            return port.port_name;
        } else {
            throw new Error('Port code not found');
        }
    } catch (error) {
        console.error('Error reading/port-code-name.json:', error);
        throw error;
    }
}