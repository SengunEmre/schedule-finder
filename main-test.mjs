
import executeAll from './utils/exec-all.mjs';
import execute from './utils/exec-all.mjs';
import {logger} from './utils/loggers.mjs';


/*
const pol = "TRALI";
const pod = "CNZQG";
const fromDate = "2024-08-06";
const toDate = "2024-08-21";

await executeAll(pol, pod,fromDate,toDate);
*/
const pairs = [
  { pol: "TRAYT", pod: "CLMJS" },
  { pol: "TRIST", pod: "SADHU" },
  { pol: "TRTEK", pod: "CLSVE" },
  { pol: "TRALI", pod: "CNZQG" },
  { pol: "TRSSX", pod: "CRCAL" },
  { pol: "TRHAY", pod: "BRPNG" },
  { pol: "TRMER", pod: "CNZQG" },
  { pol: "CAHAL", pod: "GHTEM" },
  { pol: "TRIZT", pod: "CNZSN" },
  { pol: "TRSSX", pod: "BRITJ" },
  { pol: "ITSPE", pod: "EGEDK" },
  { pol: "TRMER", pod: "SADHU" },
];
  

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  
  async function loopExecuteAll(pairs, fromDate, toDate) {
    for (const pair of pairs) {
       execute.all(pair.pol, pair.pod, fromDate, toDate);

    }
  }
  

  
    const pol = "TRIZT" ;
    const pod = "CNZSN" ;
    const fromDate = "2024-08-08";
    const toDate = "2024-08-20";

    await execute.one(pol, pod,fromDate,toDate);



      //Call the function to start the execution
  //await loopExecuteAll(pairs, fromDate, toDate);