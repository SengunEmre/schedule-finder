
import {arkasLogger} from '../utils/loggers.mjs';


export default function transformArkasData(data,pol,pod) {
  try {
    if (!data || !pol || !pod) {
      console.error('Error while formatting');
      return null;
    }

    const scheduleinfo = data;

    const legs = scheduleinfo.voyageRouteLegCalls.length;
    arkasLogger.info(legs);
    const scheduleData = {};
    scheduleData.ts = {};
    scheduleData.Carrier = "ARKAS";
    console.log(scheduleinfo);
    if (legs === 2) {
      scheduleData.polName = scheduleinfo.voyageRouteLegCalls[0]["portName"];
      scheduleData.PolCode = pol ;
      scheduleData.PolDeparture = ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[0]["departureDate"]);
      scheduleData.PodName = scheduleinfo.voyageRouteLegCalls[1]["portName"];
      scheduleData.PodCode = pod ;
      scheduleData.PodArrival = ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[1]["arrivalDate"]);
    } else if (legs === 3){
        const tsKey = `ts1`;
        scheduleData.ts[tsKey] = {
        Arrival:  ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[1]["arrivalDate"]),
        Port: scheduleinfo.voyageRouteLegCalls[1]["portName"],
        PortCode: null ,
        Departure:  ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[1]["departureDate"])
        }
        scheduleData.polName = scheduleinfo.voyageRouteLegCalls[0]["portName"];
        scheduleData.PolCode = pol ;
        scheduleData.PolDeparture =  ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[0]["departureDate"]);
        scheduleData.PodName = scheduleinfo.voyageRouteLegCalls[2]["portName"];
        scheduleData.PodCode = pod ;
        scheduleData.PodArrival =  ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[2]["arrivalDate"]);
     } else {
     for (let i = 0; i < legs; i++) 
     {
        if (i === 0) {
        scheduleData.PolName = scheduleinfo.voyageRouteLegCalls[i]["portName"];
        scheduleData.PolCode = pol;
        scheduleData.PolDeparture =  ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[i]["departureDate"]);
        
      } else if (i === legs - 1) {
        scheduleData.PodName = scheduleinfo.voyageRouteLegCalls[i]["portName"];
        scheduleData.PodCode = pod;
        scheduleData.PodArrival =  ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[i]["departureDate"]);
      } else {
        const tsKey = `ts${i}`;
        scheduleData.ts[tsKey] = {
        Arrival:  ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[i]["arrivalDate"]),
        Port: scheduleinfo.voyageRouteLegCalls[i]["portName"],
        PortCode: null,
        Departure:  ArkasDateFormat(scheduleinfo.voyageRouteLegCalls[i]["departureDate"])
        };
      } 
     }
    }
    
    return scheduleData;
    
  }  catch (error) {
    console.error('Error:', error);
    return null;
  }
}


function ArkasDateFormat(date) {
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