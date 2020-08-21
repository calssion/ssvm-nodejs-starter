const { resize_file } = require('../pkg/ssvm_nodejs_starter_lib.js');
  
const dim = {
    width: 100,
    height: 100
};

resize_file(JSON.stringify([dim, '../public/cat.png', `../public/test1.png`]));
