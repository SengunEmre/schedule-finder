import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { logger } from './loggers.mjs';

export default async function duplicateCheck(pol, pod, carrier) {
    console.log(carrier, pol, pod);
    let Check = false;
  
    // Construct the filename
    const fileName = `${pol}_to_${pod}.json`;
  
    // Get the directory name of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
    // Construct the full file path
    const filePath = path.join(__dirname, "..", 'schedules', fileName);
  
    try {
      // Check if the file already exists
      await fs.access(filePath);
      
      // If file exists, read its contents and check Carrier
      const fileContents = await fs.readFile(filePath, 'utf8');
      const scheduleData = JSON.parse(fileContents);
  
      scheduleData.forEach(element => {
        if (element.Carrier === carrier) {
          // Check if that route has carrier
          Check = true;
        }
      });
  
      if (Check) {
        logger.info(`File ${filePath} exists and Carrier is ${carrier}. Skipping further actions.`);
        return Check; 

      } else {
        return Check;
      }
  
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File does not exist
        logger.info(`File does not exist. Requesting ${carrier}.`);
        return Check;
        
      } else {
        // Handle other errors
        logger.error(`Error checking file existence or processing for ${carrier} : ${err.message}`);
        throw err; // Re-throw the error to propagate it further if needed
      }
    }
}