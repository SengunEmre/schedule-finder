import duplicateCheck from '../utils/duplicate-check.mjs';
import requests from '../utils/request-utils.mjs';
import saveAsJson from '../utils/save-as-json.mjs';
import formats from '../utils/format-utils.mjs';
import {onelineLogger} from '../utils/loggers.mjs';

export default async function executeOneService(pol, pod,fromdate,todate) {
  try {
    const duplicateExist = await duplicateCheck(pol, pod, "ONE LINE");
    if (!duplicateExist) {
      try {
        const requestdata = await requests.one(pol, pod, fromdate,todate);
        if (!requestdata.scheduleLines[0]) {
          onelineLogger.error('No data from ONE LINE');
          return null;
        } else {
         
          const data = formats.one(requestdata, pol, pod);
          await saveAsJson(data, "ONE LINE", pol, pod);
        }
      } catch (error) {
        onelineLogger.error('Error during data processing on ONE LINE:', error);
        return null;
      }
    }
  } catch (error) {
    onelineLogger.error('Error checking for duplicates on ONE LINE:', error);
    return null;
  }
}
