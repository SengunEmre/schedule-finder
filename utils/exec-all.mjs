import executeArkasService from '../executions/arkas.mjs';
import executeMscService from '../executions/msc.mjs';
import executeOneService from '../executions/one.mjs';
import executeEvergreenService from '../executions/evergreen.mjs';

const execute = {
    arkas: executeArkasService,
    msc: executeMscService,
    one: executeOneService,
    evergreen: executeEvergreenService,
    all: executeAll
};

export async function executeAll(pol, pod, fromDate, toDate) {
    await execute.arkas(pol, pod, fromDate);
    await execute.msc(pol, pod);
    await execute.one(pol, pod, fromDate, toDate);
    await execute.evergreen(pol, pod, fromDate, toDate);
}

export default execute;
