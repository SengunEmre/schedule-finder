import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

export default async function portcodeCheck(portname, portcode) {
    if (!portname || !portcode) {
        console.error('Error while formatting');
        return null;
      }
    let Check = false;
     console.log(portname, portcode);
    // Construct the filename
    const fileName = `port-code-library.json`;
  
    // Get the directory name of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
    // Construct the full file path
    const filePath = path.join(__dirname, "..", fileName);
  
    try {
        // Check if the file already exists
        await fs.access(filePath);
        
        // If file exists, read its contents and check portcode
        const fileContents = await fs.readFile(filePath, 'utf8');
        const ports = JSON.parse(fileContents);
  
        ports.forEach(element => {
            if (element.portcode === portcode) {
                // Check if that port code exists in the library
                Check = true;
            }
        });
  
        if (Check) {
            console.log(`${portcode} exists in port code library.`);
            return Check; 
        } else {
            const portinfo = { portcode, portname };
            await writeObjectToFile(filePath, portinfo);
        }
        return null;

    } catch (err) {
        if (err.code === 'ENOENT') {
            // File does not exist
            console.log(`code-library does not exist.`);
            return null;
        } else {
            // Handle other errors
            console.error(`Error checking file existence or processing: ${err.message}`);
            return null;
            throw err; // Re-throw the error to propagate it further if needed
        }
    }
}

async function writeObjectToFile(filePath, newObject) {
    let data = [];
  

    // Check if the file exists
    await fs.access(filePath);
    // Read the existing contents of the file
    const existingData = await fs.readFile(filePath, 'utf8');
    data = JSON.parse(existingData);

    // Add the new object to the data array
    data.push(newObject);
  
    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Object added to ${filePath}`);
    return null;

}

