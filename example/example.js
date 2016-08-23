//import lib
const negapoji = require('../libs/negapoji');

//example text
const txt = "日本IBMは北海道釧路市および弟子屈町の「観光客おもてなし能力向上プロジェクト業務」を受注し、外国人観光客の評判やニーズを把握するために英語圏、中国語繁体字圏、中国語簡体字圏でのツイートやブログ等を分析する「ソーシャル・メディア分析」と、観光関連情報の入手や発信を支援するスマートフォン・アプリケーション（スマホアプリ）「おもてなしパスポート（仮）」の構築を支援します";

//building
negapoji.build({},(err,calculator) => {
  if(err){
    //error handling
    throw err;
  }
  //get score
  const score = calculator.calc(txt);
  console.log('score : ', score);
});

