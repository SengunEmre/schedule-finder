import duplicateCheck from '../utils/duplicate-check.mjs';
import requests from '../utils/request-utils.mjs';
import saveAsJson from '../utils/save-as-json.mjs';
import formats from '../utils/format-utils.mjs';
import {evergreenLogger} from '../utils/loggers.mjs';
import getPortNameByCode from '../utils/get-port-name.mjs';

export default async function executeEvergreenService(pol, pod, date) {
  try {
    const duplicateExist = await duplicateCheck(pol, pod, "Evergreen");
    if (!duplicateExist) {
      const polname = await getPortNameByCode(pol);
      const podname = await getPortNameByCode(pod);

      try {
        const requestdata = await requests.Evergreen(polname, podname, date);
        console.log(requestdata);

        if (!requestdata) {
          evergreenLogger.error('No data from Evergreen');
          return null;
        } else {
          const data = formats.evergreen(requestdata, pol, pod);
          await saveAsJson(data, "EVERGREEN", pol, pod);
        }
      } catch (error) {
        evergreenLogger.error('Error during data processing on Evergreen:', error);
        return null;
      }
    }
  } catch (error) {
    evergreenLogger.error('Error checking for duplicates on Evergreen:', error);
    return null;
  }
}
