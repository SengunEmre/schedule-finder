
import {onelineLogger} from '../utils/loggers.mjs';

export default function transformOneData(data) {
  try {
  if (!data) {
    onelineLogger.error('Error while formatting');
    return null;
  }

  const scheduleinfo = data.scheduleLines[0].journeys;
  const legs = scheduleinfo.length;
  const trans = legs-1;
  const scheduleData = {};
  scheduleData.ts = {};
  scheduleData.Carrier = "ONE LINE";
  
  if (legs === 1) {
    scheduleData.polName = scheduleinfo[0]["polName"];
    scheduleData.PolCode = scheduleinfo[0]["polCode"];
    scheduleData.PolDeparture = oneDateFormat(scheduleinfo[0]["departureDate"]);
    scheduleData.PodName = scheduleinfo[0]["podName"];
    scheduleData.PodCode = scheduleinfo[0]["podCode"];
    scheduleData.PodArrival = oneDateFormat(scheduleinfo[0]["berthingDate"]);
  } else if (legs === 2){
      const tsKey = `ts1`;
      scheduleData.ts[tsKey] = {
      Arrival: oneDateFormat(scheduleinfo[0]["berthingDate"]),
      Port: scheduleinfo[1]["polName"],
      PortCode: scheduleinfo[1]["polCode"],
      Departure: oneDateFormat(scheduleinfo[1]["departureDate"])
      }
    scheduleData.polName = scheduleinfo[0]["polName"];
    scheduleData.PolCode = scheduleinfo[0]["polCode"];
    scheduleData.PolDeparture = oneDateFormat(scheduleinfo[0]["departureDate"]);
    scheduleData.PodName = scheduleinfo[1]["podName"];
    scheduleData.PodCode = scheduleinfo[1]["podCode"];
    scheduleData.PodArrival = oneDateFormat(scheduleinfo[1]["berthingDate"]);
   } else {

   for (let i = 0; i < legs; i++) 
   {
      if (i === 0) {
      scheduleData.PolName = scheduleinfo[i]["polName"];
      scheduleData.PolCode = scheduleinfo[i]["polCode"];
      scheduleData.PolDeparture = oneDateFormat(scheduleinfo[i]["departureDate"]);
      
    } else if (i === legs - 1) {
      scheduleData.PodName = scheduleinfo[i]["podName"];
      scheduleData.PodCode = scheduleinfo[i]["podCode"];
      scheduleData.PodArrival = oneDateFormat(scheduleinfo[i]["berthingDate"]);
    } else {
      let k = i-1;
      const tsKey = `ts${i}`;
      scheduleData.ts[tsKey] = {
      Arrival: oneDateFormat(scheduleinfo[k]["berthingDate"]),
      Port: scheduleinfo[i]["polName"],
      PortCode: scheduleinfo[i]["polCode"],
      Departure: oneDateFormat(scheduleinfo[i]["departureDate"])
      };
    } 
   }
  }
  return scheduleData;
}  catch (error) {
  onelineLogger.error('Error:', error);
  return null;
}
}


function oneDateFormat(date) {
  
  // Create a new Date object from the ISO string
  const newdate = new Date(date);

  // Extract the day, month, and year
  const day = newdate.getDate().toString().padStart(2, '0');
  const month = (newdate.getMonth() + 1).toString().padStart(2, '0');
  const year = newdate.getFullYear();

  // Format the date as "DD/MM/YYYY"
  const newformatteddate = `${day}/${month}/${year}`;
  return newformatteddate;
}
/*
  legs = 1 direct no problem
  legs = 2 
  aktarma varış scheduleData.PodArrival = scheduleinfo[0]["berthingDate"];
  aktarma kalkış scheduleData.PodArrival = scheduleinfo[1]["departureDate"];
  almak lazım

  leg = 3 
  aktarma varış scheduleData.PodArrival = scheduleinfo[0]["berthingDate"];
  aktarma kalkış scheduleData.PodArrival = scheduleinfo[1]["departureDate"];
  aktarma varış scheduleData.PodArrival = scheduleinfo[1]["berthingDate"];
  aktarma kalkış scheduleData.PodArrival = scheduleinfo[2]["departureDate"];

  leg -1 = transipment

  if (legs === 1) {
    onelineLogger.log("DIRECT")
    scheduleData.polName = scheduleinfo[0]["polName"];
    scheduleData.PolCode = scheduleinfo[0]["polCode"];
    scheduleData.PolDeparture = scheduleinfo[0]["departureDate"];
    scheduleData.Pod = scheduleinfo[0]["podName"];
    scheduleData.PodCode = scheduleinfo[0]["podCode"];
    scheduleData.PodArrival = scheduleinfo[0]["berthingDate"];
  } else if (legs === 2){
      const tsKey = `ts1`;
      scheduleData.ts[tsKey] = {
      Arrival: scheduleinfo[0]["berthingDate"],
      Port: scheduleinfo[1]["polName"],
      PortCode: scheduleinfo[1]["polCode"],
      Departure: scheduleinfo[1]["departureDate"];
      }
    scheduleData.polName = scheduleinfo[0]["polName"];
    scheduleData.PolCode = scheduleinfo[0]["polCode"];
    scheduleData.PolDeparture = scheduleinfo[0]["departureDate"];
    scheduleData.Pod = scheduleinfo[0]["podName"];
    scheduleData.PodCode = scheduleinfo[0]["podCode"];
    scheduleData.PodArrival = scheduleinfo[0]["berthingDate"];
   } else {

   for (let i = 0; i < legs; i++) 
   {
      if (i === 0) {
      scheduleData.Pol = scheduleinfo[i]["polName"];
      scheduleData.PolCode = scheduleinfo[i]["polCode"];
      scheduleData.PolDeparture = scheduleinfo[i]["departureDate"];
      
    } else if (i === legs - 1) {
      scheduleData.Pod = scheduleinfo[i]["podName"];
      scheduleData.PodCode = scheduleinfo[i]["podCode"];
      scheduleData.PodArrival = scheduleinfo[i]["berthingDate"];
    } else {
      const tsKey = `ts${i}`;
      scheduleData.ts[tsKey] = {
      Arrival: scheduleinfo[i]["berthingDate"],
      Port: scheduleinfo[i]["polName"],
      PortCode: scheduleinfo[i]["polCode"],
      Departure: scheduleinfo[i]["departureDate"]
      };
     
   }
 

   **************************************************



if (legs === 1){
  onelineLogger.log("DIRECT")
  scheduleData.polName = scheduleinfo[0]["polName"];
  scheduleData.PolCode = scheduleinfo[0]["polCode"];
  scheduleData.PolDeparture = scheduleinfo[0]["departureDate"];
  scheduleData.Pod = scheduleinfo[0]["podName"];
  scheduleData.PodCode = scheduleinfo[0]["podCode"];
  scheduleData.PodArrival = scheduleinfo[0]["berthingDate"];
} else{
  
for (let i = 0; i < legs; i++) {
  onelineLogger.log(i);
  if (i === 0) {
    scheduleData.Pol = scheduleinfo[i]["polName"];
    scheduleData.PolCode = scheduleinfo[i]["polCode"];
    scheduleData.PolDeparture = scheduleinfo[i]["departureDate"];
    
  } else if (i === legs - 1) {
    scheduleData.Pod = scheduleinfo[i]["podName"];
    scheduleData.PodCode = scheduleinfo[i]["podCode"];
    scheduleData.PodArrival = scheduleinfo[i]["berthingDate"];
  } else {
    const tsKey = `ts${i}`;
    onelineLogger.log("else");
    scheduleData.ts[tsKey] = {
      Arrival: scheduleinfo[i]["departureDate"],
      Port: scheduleinfo[i]["polName"],
      PortCode: scheduleinfo[i]["polCode"],
      Departure: scheduleinfo[i]["berthingDate"]
    };
}
   

*/
