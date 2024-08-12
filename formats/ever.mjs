import {evergreenLogger} from '../utils/loggers.mjs';

export default function transformEverData(data,pol,pod) {
    try {
      if (!data || !pol || !pod) {
        console.error('Error while formatting');
        return null;
      } 
      evergreenLogger.info(data);
      const scheduleinfo = data;
      let transsipmentcount = 1 
      const legs = scheduleinfo.length;
      const scheduleData = {};
      scheduleData.ts = {};
      scheduleData.Carrier = "EVERGREEN";
      evergreenLogger.info(legs);

      if (legs === 1){
        scheduleData.PolName            = scheduleinfo[0][1];
        scheduleData.PolCode            = null ;
        scheduleData.PolDeparture       = everDateFormat(scheduleinfo[0][3]);
        scheduleData.PodName            = scheduleinfo[0][2];
        scheduleData.PodCode            = null ;
        scheduleData.PodArrival         = everDateFormat(scheduleinfo[0][4]);
      } else {

        scheduleData.PolName            = scheduleinfo[0][1];
        scheduleData.PolCode            = null ;
        scheduleData.PolDeparture       = everDateFormat(scheduleinfo[0][3]);
        scheduleData.PodName            = scheduleinfo[legs-1][2];
        scheduleData.PodCode            = null ;
        scheduleData.PodArrival         = everDateFormat(scheduleinfo[legs-1][4]);

        for (let i = 1; i < legs; i++) {
          if(scheduleinfo[i][1] == scheduleinfo[i][2]){
              const tsKey = `ts${transsipmentcount}`;
              scheduleData.ts[tsKey] = {
              Arrival: everDateFormat(scheduleinfo[i][3]),
              Port: scheduleinfo[i][1],
              PortCode: null,
              Departure: everDateFormat(scheduleinfo[i][4])
            };
            transsipmentcount++; 
          } else {
            if( scheduleinfo[i][1] == scheduleinfo[i-1][2]){
              const temptsKey = `ts${transsipmentcount-1}`;
              const tsKey = `ts${transsipmentcount}`;
              if(scheduleData.ts[temptsKey].Port !== scheduleinfo[i][1]){

                scheduleData.ts[tsKey] = {
                Arrival:everDateFormat(scheduleinfo[i-1][4]),
                Port: scheduleinfo[i][1],
                PortCode: null,
                Departure: everDateFormat(scheduleinfo[i][3])
              };
              transsipmentcount++ ;

              }
            }
          }
        }
      }
        

      return scheduleData;




    }  catch (error) {
    console.error('Error:', error);
    return null;
      }
}


function everDateFormat(date) {
  if (typeof date !== 'string') {
    throw new Error("Invalid input: expected a string");
  }

  
  // Split the date string to extract components
  const parts = date.split('-');
  if (parts.length !== 3) {
    throw new Error("Invalid date format");
  }
  // Map month names to their corresponding numbers
  const monthMap = {
    JAN: '01',
    FEB: '02',
    MAR: '03',
    APR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12'
  };

  // Extract the month, day, and year
  const month = monthMap[parts[0].toUpperCase()];
  const day = parts[1].padStart(2, '0');
  const year = parts[2];

  if (!month) {
    throw new Error("Invalid month format");
  }

  // Format the date as "DD/MM/YYYY"
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}




// onst data = [
//  [
//    "1",
//    "MERSIN",
//    "PIRAEUS",
//    "AUG-03-2024",
//    "AUG-08-2024",
//    "LEV",
//    "VEGA COLIGNY 0612-028W",
//    "5"
//  ],
//  [
//    "2",
//    "PIRAEUS",
//    "PIRAEUS",
//    "AUG-08-2024",
//    "AUG-09-2024",
//    "WAITING",
//    "----",
//    "1"
//  ],
//  [
//    "3",
//    "PIRAEUS",
//    "SHEKOU, CHINA",
//    "AUG-09-2024",
//    "SEP-22-2024",
//    "BEX",
//    "CSCL MERCURY 093E",
//    "44"
//  ],
//  [
//    "4",
//    "SHEKOU, CHINA",
//    "ZHAOQING, GUANGDONG",
//    "SEP-22-2024",
//    "SEP-26-2024",
//    "Feeder",
//    "----",
//    "4"
//  ]
// 
// ransformArkasData(data,"TRMER","CNZLX");
// 