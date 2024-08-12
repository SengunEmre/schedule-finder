import arkasRequest from '../requests/arkas.mjs';
import mscRequest from '../requests/msc.mjs';
import oneRequest from '../requests/one.mjs';
import EvergreenRequest from '../requests/evergreen.mjs';



const requests = {
    arkas: arkasRequest,
    msc: mscRequest,
    one: oneRequest,
    Evergreen: EvergreenRequest,
  };
  
  export default requests;