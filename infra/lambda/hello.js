exports.handler = async function (event) {
  console.log("\n\nEVENT\n===================\n", event);
  // return { status: 200, body: "hello world 2" };

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {},
    body: "hello from lambda! path is:" + event?.path ?? "",
  };
};
