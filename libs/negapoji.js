/**
 * negapoji
 *
 */
const kuromoji = require('kuromoji'),
  path = require('path'),
  fs = require('fs');

const negapoji = () => {};

/**
 * kuromoji build
 */
const kuromoji_build = (opts) => {
  var opts = opts || {};

  const dic_path = '/../node_modules/kuromoji/dict',
  dic_dir = path.normalize(__dirname + dic_path),
  _filter = typeof opts.filter !== 'undefined' ? (val) => (val.pos === '名詞' || val.pos === '動詞' || val.pos === '形容詞' || val.pos === '副詞') : opts.filter,
  _kuromoji_dic = typeof opts.kuromoji_dic === 'undefined' ? dic_dir : opts.kuromoji_dic;


  return new Promise((res,rej) => {
    kuromoji.builder({dicPath: _kuromoji_dic}).build((err, tokenizer) => {
      if (err) {
        rej(err);
      }
      res(tokenizer);
    });
  });
};

const sentiment_build = (opts) => {

  const default_parser_noun = (rows, dict) => {
    var dict = dict || {};
    rows.map((row) => {
      const fields = row.split("\t"),
      v = fields[1] === 'p' ? 1 : fields[1] === 'n' ? -1 : 0;
      dict[fields[0]] = [fields[0], v, fields[2]];
    });
    return dict;
  };

  const default_parser_term = (rows, dict) => {
    var dict = dict || {};
    rows.map((row) => {
      const fields = row.split("\t"),
      pos = (fields[0].indexOf('ポジ') >= 0) ? 1 : -1,
      env = (fields[0].indexOf('評価') >= 0) ? '評価' : '経験';

      dict[fields[1]] = [fields[1], pos, env];
    });
    return dict;
  };

  const _default = '/../dict/',
    dic_files = [
      {file: 'pn.csv.m3.120408.trim', parser: default_parser_noun},
      {file: 'wago.121808.pn', parser: default_parser_term}
    ];

  const read = (files, dict, cb) => {
    if(files.length <= 0) {
      return cb(dict);
    }
    const _obj = files.pop();
    const file = path.normalize(__dirname + _default  + _obj.file);
    dict = (dict instanceof Object) ? dict : {};
    fs.readFile(file, (e, data) =>{
      if (e) {
        throw e;
      }
      _obj.parser(data.toString().split("\n"), dict);
      read(files, dict, cb);
    });
  };

  return new Promise((res, rej) => {
    read(dic_files,[],(dict) => {
      res(dict);
    });
  });



};

const add_sentiment_param = (dict,words) => {
      words.filter((word) => dict[word.basic_form || word.surface_form]).map((word) => {
        word.sc = dict[word.basic_form || word.surface_form];
      });
      return words;
};

const calculate = (words) => {
      var filter_val = words.filter((word) => word.sc);
      var total_score = filter_val.map((word) => {
        return word.sc[1];
      }).reduce((x, y) => x + y);

//     console.log('num : ' , filter_val.length);
//     console.log('total_score : ' , total_score);
      return total_score/filter_val.length;
};

negapoji.build = (opts,cb) => {
  Promise.all([kuromoji_build(), sentiment_build()]).then((result) => {
    const tokenizer = result[0];
    const sentiment_dic = result[1];
    cb(null,{
      calc(txt) {
        var words = tokenizer.tokenize(txt);
        words = add_sentiment_param(sentiment_dic,words)
        return calculate(words);
      }
    });
  }).catch((e) => {
    cb(e);
  });
};

module.exports = negapoji;
