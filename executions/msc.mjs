import duplicateCheck from '../utils/duplicate-check.mjs';
import requests from '../utils/request-utils.mjs';
import saveAsJson from '../utils/save-as-json.mjs';
import formats from '../utils/format-utils.mjs';
import {mscLogger} from '../utils/loggers.mjs';

export default async function executeMscService(pol, pod, date) {
  try {
    const duplicateExist = await duplicateCheck(pol, pod, "MSC LINE");
    if (!duplicateExist) {
      try {
        const requestdata = await requests.msc(pol, pod, date);

        if (!requestdata) {
          mscLogger.error('No data from MSC LINE');
          return null;
        } else {
          const data = formats.msc(requestdata, pol, pod);
          await saveAsJson(data, "MSC LINE", pol, pod);
        }
      } catch (error) {
        mscLogger.error('Error during data processing on MSC LINE:', error);
        return null;
      }
    }
  } catch (error) {
    mscLogger.error('Error checking for duplicates on MSC LINE:', error);
    return null;
  }
}
