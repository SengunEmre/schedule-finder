import fs from 'fs';


export default function transformMscData(data) {
  try {
    if (!data) {
      console.error('Error while formatting');
      return null;
    }
  const scheduleinfo = data["Data"][0]["Routes"][0]["RouteScheduleLegDetails"];
  const legs = scheduleinfo.length;

  const scheduleData = {};
  scheduleData.ts = {};
  scheduleData.Carrier = "MSC";
  
  if (legs === 1){
    scheduleData.PolName            = scheduleinfo[0]["DeparturePortName"];
    scheduleData.PolCode            = scheduleinfo[0]["DeparturePortUNCode"];
    scheduleData.PolDeparture       = mscDateFormat(scheduleinfo[0]["EstimatedDepartureTimeFormatted"]);
    scheduleData.PodName            = scheduleinfo[0]["ArrivalPortName"];
    scheduleData.PodCode            = scheduleinfo[0]["ArrivalPortUNCode"];
    scheduleData.PodArrival         = mscDateFormat(scheduleinfo[0]["EstimatedArrivalTimeFormatted"]);
  } else{
  for (let i = 0; i < legs; i++) {
    if (i === 0) {
      scheduleData.PolName          = scheduleinfo[i]["DeparturePortName"];
      scheduleData.PolCode          = scheduleinfo[i]["DeparturePortUNCode"];
      scheduleData.PolDeparture     = mscDateFormat(scheduleinfo[i]["EstimatedDepartureTimeFormatted"]);
      
    } else if (i === legs - 1) {
      scheduleData.PodName          = scheduleinfo[i]["ArrivalPortName"];
      scheduleData.PodCode          = scheduleinfo[i]["ArrivalPortUNCode"];
      scheduleData.PodArrival       = mscDateFormat(scheduleinfo[i]["EstimatedArrivalTimeFormatted"]);
    } else {
      const tsKey = `ts${i}`;
      scheduleData.ts[tsKey] = {
        Arrival: mscDateFormat(scheduleinfo[i]["EstimatedArrivalTimeFormatted"]),
        Port: scheduleinfo[i]["ArrivalPortName"],
        PortCode: scheduleinfo[i]["ArrivalPortUNCode"],
        Departure: mscDateFormat(scheduleinfo[i]["EstimatedDepartureTimeFormatted"])
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

function mscDateFormat(date) {
  
  // Split the date string to extract components
  const parts = date.split(' ');
  if (parts.length < 4) {
    throw new Error("Invalid date format");
  }

  // Map month names to their corresponding numbers
  const monthMap = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
  };

  // Extract the day, month, and year
  const dayPart = parts[1].match(/\d+/);
  if (!dayPart) {
    throw new Error("Invalid day format");
  }

  const day = dayPart[0].padStart(2, '0');
  const month = monthMap[parts[2]];
  const year = parts[3];

  if (!month) {
    throw new Error("Invalid month format");
  }

  // Format the date as "DD/MM/YYYY"
  const newformatteddate = `${day}/${month}/${year}`;
  return newformatteddate;
}
