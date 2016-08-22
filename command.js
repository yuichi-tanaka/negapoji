
const kuromoji = require('kuromoji'),
  path = require('path'),
  fs = require('fs'),
  dic_path = '/node_modules/kuromoji/dict',
  dic_dir = path.normalize(__dirname + dic_path);

const negapoji = require('./libs/negapoji');

const argv = process.argv;

const _utils = {
  exit(code, msg) {
    msg = typeof msg === 'undefined' ? 'unset error message' : msg;
    console.error(msg);
    process.exit(code);
  },
  shift(num) {
    num = typeof num === 'undefined' ? 1 : num;
    if(!(this instanceof Array)){
      _utils.exit(1,'usage _utils.shift.call(<Array>,num)');
    }
    for(var i = num; i--; this.shift());
  },
};

  if(argv.length <= 2){
    _utils.exit(1,'usege: node command.js すもももももももものうち');
  }
  _utils.shift.call(argv,2);

  const txt = argv[0];


negapoji.build({},(err, build_obj) => {
  if(err){
    throw err;
  }
  var res = build_obj.calc(txt);
  console.log('score : ', res , ' n/p :' , (res >= 0) ?  'positive' : 'negative');
});
