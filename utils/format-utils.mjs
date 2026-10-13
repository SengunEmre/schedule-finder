import transformArkasData from '../formats/arkas.mjs';
import transformMscData from '../formats/msc.mjs';
import transformOneData from '../formats/one.mjs';
import transformEverData from '../formats/ever.mjs';
w

const formats = {
    arkas: transformArkasData,
    msc: transformMscData,
    one: transformOneData,
    evergreen : transformEverData
  };
  
  export default formats;