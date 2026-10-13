
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath function from url module
import portcodeCheck from './port-code-check.mjs'
// Function to write an object to a JSON file
export function writeObjectToFile(filePath, newObject) {
  let data = [];

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Read the existing contents of the file
    const existingData = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(existingData);
  }

  // Add the new object to the data array
  data.push(newObject);

  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Object added to ${filePath}`);
}

// Function to save schedule data
export default async function saveAsJson(scheduleData , carrier , pol, pod) {
  try {
    if (!scheduleData) {
      console.error('Error while saving json',carrier);
      return null;
    }
    if (!pol || !pod) {
      const pol = scheduleData.PolCode;
      const pod = scheduleData.PodCode;
      return null;
    } else {
      const pol = scheduleData.PolCode;
      const pod = scheduleData.PodCode;
    }


  //await portcodeCheck(scheduleData.Pod,scheduleData.PodCode);
//
  //await portcodeCheck(scheduleData.polName,scheduleData.PolCode);
//
  // Construct the file name  


  const fileName = `${pol}_to_${pod}.json`;

  // Get the directory name of the current module
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Construct the full file path

  const filePath = path.join(__dirname, "..", 'schedules', fileName);

  console.log(filePath);

  // Ensure the directory exists before writing the file
  if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname, { recursive: true });
  }

  // Write scheduleData to the file
  writeObjectToFile(filePath, scheduleData);

}  catch (error) {
  console.error('Error:', error);
  return null;
}
}
