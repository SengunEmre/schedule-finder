// Import required modules
import axios from 'axios';
import {onelineLogger} from '../utils/loggers.mjs';


// Function to fetch data and save to a JSON file
 export default async function oneRequest(pol,pod ,fromdate,todate) {
    try {
        
        // Define the URL and parameters
        
        const baseUrl = 'https://ecomm.one-line.com/api/v1/schedule/point-to-point';
        
        const porCode = pol; // POL
        
        const delCode = pod; // POD
        
        const fromDate = fromdate;      // DATES !!!!! !!!!!
        
        const toDate = todate;


        
        // Construct the full URL with parameters
        
        
        const apiUrl = `${baseUrl}?porCode=${porCode}&delCode=${delCode}&fromDate=${fromDate}&toDate=${toDate}&rcvTermCode=Y&deTermCode=Y&tsFlag=&polCode=&podCode=&searchType=List`;        
        // Make GET request to API
        
        const response = await axios.get(apiUrl);

        // Extract data from response
        
        const scheduleData = response.data

        return scheduleData;

    } catch (error) {
        onelineLogger.error('Error fetching data:', error.message);
    }
}

// Call the function to fetch data and save it


