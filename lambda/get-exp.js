const { DynamoDBClient, PutItemCommand,QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall,unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_user";

/*** 通常版の解答例(発展課題を含む最終版は下にあります。) ***/
exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  
  // 今回は簡易的な実装だが、一般的にはAuthorizationHeaderの値は、Authorization: <type> <credentials>のような形式になります。
  https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Authorization#%E6%A7%8B%E6%96%87
  if (event.headers.authorization !== "mtiToken") {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください",
    });

    return response;
  }

//   const body = event.body ? JSON.parse(event.body) : null;
//   if (!body || !body.userId || !body.age || !body.nickname || !body.password) {
//     response.statusCode = 400;
//     response.body = JSON.stringify({
//       message:
//         "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
//     });

//     return response;
//   }

  // { varName }のような形式を分割代入と呼び、右側のオブジェクトの中からvarNameプロパティを変数varNameとして切り出すことができる
  // (https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
 const { userId,exp } = JSON.parse(event.body);
 
 
 const queryParam = {
      TableName,
      ExpressionAttributeNames:{
          '#u': 'userId',
      },
      ExpressionAttributeValues:{
          ':userId': userId,
      },
      KeyConditionExpression: '#u = :userId'
 };
    
    queryParam.ExpressionAttributeValues = marshall(queryParam.ExpressionAttributeValues);
 

  // 指定したアイテムを取得するコマンドを用意
  const queryCommand = new QueryCommand(queryParam);

  try {
    const user = (await client.send(queryCommand)).Items;
    const unmarshallUser = unmarshall(user[0]);
    const newExp = Number(exp) + Number(unmarshallUser.exp);
    const putParam = {
        TableName,
        Item: marshall({
        userId,
        'exp' : newExp, 
        }),
    };
    const putCommand = new PutItemCommand(putParam);
    await client.send(putCommand);
    response.body = JSON.stringify({newExp});
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};



