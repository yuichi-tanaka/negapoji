/**
 * negapoji
 * - build
 *   (error, calculator) => {}
 */
const kuromoji = require('kuromoji'),
  path = require('path'),
  fs = require('fs');

const negapoji = () => {};

/**
 * kuromoji build
 * - opts.filter
 * - opts.kuromoji_dic
 */
const kuromoji_build = (opts) => {
  opts = opts || {};

  const dic_path = '/../node_modules/kuromoji/dict',
    dic_dir = path.normalize(path.join(__dirname, dic_path)),
    _kuromoji_dic = typeof opts.kuromoji_dic === 'undefined' ? dic_dir : opts.kuromoji_dic;

  return new Promise((resolve, reject) => {
    kuromoji.builder({dicPath: _kuromoji_dic}).build((err, tokenizer) => {
      if (err) {
        reject(err);
      }
      resolve(tokenizer);
    });
  });
};

/**
 * sentiment_build
 * - opts.
 */
const sentiment_build = (opts) => {
  /**
   * default_parser_noun
   */
  const default_parser_noun = (rows, dict) => {
    dict = dict || {};
    rows.map((row) => {
      const fields = row.split('\t'),
        v = fields[1] === 'p' ? 1 : fields[1] === 'n' ? -1 : 0;
      dict[fields[0]] = [fields[0], v, fields[2]];
    });
    return dict;
  };

  /**
   * default_parser_term
   */
  const default_parser_term = (rows, dict) => {
    dict = dict || {};
    rows.map((row) => {
      const fields = row.split('\t'),
        pos = (fields[0].indexOf('ポジ') >= 0) ? 1 : -1,
        env = (fields[0].indexOf('評価') >= 0) ? '評価' : '経験';

      dict[fields[1]] = [fields[1], pos, env];
    });
    return dict;
  };

  /**
   * default dictionalies
   */
  const _default = '/../dict/',
    dic_files = [
      {file: 'pn.csv.m3.120408.trim', parser: default_parser_noun},
      {file: 'wago.121808.pn', parser: default_parser_term}
    ];

  /**
   * file reader
   */
  const read = (files, dict, cb) => {
    if (files.length <= 0) {
      return cb(dict);
    }
    const _obj = files.pop(),
      file = path.normalize(path.join(__dirname, _default, _obj.file));
    dict = (dict instanceof Object) ? dict : {};
    fs.readFile(file, (e, data) => {
      if (e) {
        throw e;
      }
      _obj.parser(data.toString().split('\n'), dict);
      read(files, dict, cb);
    });
  };

  return new Promise((resolve, reject) => {
    read(dic_files, [], (dict) => {
      resolve(dict);
    });
  });
};

/**
 * add_sentiment_param
 */
const add_sentiment_param = (dict, words) => {
  words.filter((word) => dict[word.basic_form || word.surface_form]).map((word) => {
    word.sc = dict[word.basic_form || word.surface_form];
  });
  return words;
};

/**
 * calculate
 */
const calculate = (words) => {
  var filter_val = words.filter((word) => word.sc),
    total_score = filter_val.map((word) => {
      return word.sc[1];
    }).reduce((x, y) => x + y);

  return total_score / filter_val.length;
};

/**
 * build
 */
negapoji.build = (opts, cb) => {
  Promise.all([kuromoji_build(), sentiment_build()]).then((result) => {
    const tokenizer = result[0],
      sentiment_dic = result[1],
      _filter = typeof opts.filter === 'undefined' ? (val) => (val.pos === '名詞' || val.pos === '動詞' || val.pos === '形容詞' || val.pos === '副詞') : opts.filter;
    cb(null, {
      calc (txt) {
        var words = tokenizer.tokenize(txt).filter(_filter);
        words = add_sentiment_param(sentiment_dic, words);
        return calculate(words);
      }
    });
  }).catch((e) => {
    cb(e);
  });
};

module.exports = negapoji;
