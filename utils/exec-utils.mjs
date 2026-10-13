import executeArkasService from '../executions/arkas.mjs';
import executeMscService from '../executions/msc.mjs';
import executeOneService from '../executions/one.mjs';
import executeEvergreenService from '../executions/evergreen.mjs'

const exacute = {
    arkas: executeArkasService,
    msc: executeMscService,
    one: executeOneService,
    evergreen: executeEvergreenService,

  };

  export default exacute;