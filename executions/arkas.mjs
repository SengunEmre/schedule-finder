import duplicateCheck from '../utils/duplicate-check.mjs';
import requests from '../utils/request-utils.mjs';
import saveAsJson from '../utils/save-as-json.mjs';
import formats from '../utils/format-utils.mjs';
import {arkasLogger} from '../utils/loggers.mjs';

export default async function executeArkasService(pol, pod, date) {
  try {
    
    const duplicateExist = await duplicateCheck(pol, pod, "ARKAS LINE");
    if (!duplicateExist) {
      try {
        const requestdata = await requests.arkas(pol, pod, date);

        if (!requestdata) {
          arkasLogger.error('No data from ARKAS LINE');
          return null;
        } else {
          const data = formats.arkas(requestdata, pol, pod);
          await saveAsJson(data, "ARKAS LINE", pol, pod);
        }
      } catch (error) {
        arkasLogger.error('Error during data processing on ARKAS LINE:', error);
        return null;
      }
    }
  } catch (error) {
    arkasLogger.error('Error checking for duplicates on ARKAS LINE :', error);
    return null;
  }
}
