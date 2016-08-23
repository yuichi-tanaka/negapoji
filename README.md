# negapoji
negapoji is sentiment classification of node.js in Japanese.

##install

```bash
npm i --save negapoji
```

##Usage

command

```bash
node command.js <Japanese sentence>
```

```nodejs
//import lib
const negapoji = require('negapoji');

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
```

negapojiは日本語評価極性辞書を利用しています。
>1. 小林のぞみ，乾健太郎，松本裕治，立石健二，福島俊一. 意見抽出のための評価表現の収集. 自然言語処理，Vol.12, No.3, pp.203-222, 2005. / Nozomi Kobayashi, Kentaro Inui, Yuji Matsumoto, Kenji Tateishi. Collecting Evaluative Expressions for Opinion Extraction, Journal of Natural Language Processing 12(3), 203-222, 2005.
>2. 東山昌彦, 乾健太郎, 松本裕治, 述語の選択選好性に着目した名詞評価極性の獲得, 言語処理学会第14回年次大会論文集, pp.584-587, 2008. / Masahiko Higashiyama, Kentaro Inui, Yuji Matsumoto. Learning Sentiment of Nouns from Selectional Preferences of Verbs and Adjectives, Proceedings of the 14th Annual Meeting of the Association for Natural Language Processing, pp.584-587, 2008.
