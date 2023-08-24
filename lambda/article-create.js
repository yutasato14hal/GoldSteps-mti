const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2-article";
 
exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
 
  // TODO: リクエストボディの中身をJavaScriptオブジェクトに変換し、1つ、あるいは複数の変数に代入する
  const {text, timestamp} = event.body ? JSON.parse(event.body) : null;
  
  
  if (!timestamp || !text){
    response.statusCode = 400;
    response.body = JSON.stringify({
      message : "無効なリクエストです。request bodyに必須パラメータがセットされていません。"
      })
    return response;
  }
 
  // TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
  const userId = event.queryStringParameter.userId;
  const param = {
    TableName,
    "Item" : marshall({
      userId,
      text,
      timestamp
    })
  };
 
  // DBにデータを登録するコマンドを用意
  const command = new PutItemCommand(param);
 
  try {
    // client.send()でDBにデータを登録するコマンドを実行
    await client.send(command);
    // TODO: 登録に成功した場合の処理を記載する。(status codeの設定と、response bodyの設定)
    response.statusCode = 200;
    response.body = JSON.stringify({userId,timestamp,text});
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }
 
  return response;
};