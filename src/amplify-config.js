// This file is used for manual configuration of the Amplify library.
// When Amplify is used in conjunction with the Amplify CLI toolchain or AWS Mobile Hub to manage backend resources,
// an aws-exports.js file is auto-generated and can be used instead of the below to automatically configure the Amplify library.
// In this workshop, we are using the Amplify client libraries without the CLI toolchain so you should edit this file manually.

const awsConfig = {
  Auth: {
    identityPoolId: "eu-west-1:09668304-10ba-45c5-8626-024411be5f49", // example: 'us-east-2:c85f3c18-05fd-4bb5-8fd1-e77e7627a99e'
    region: "eu-west-1", // example: 'us-east-2'
    userPoolId: "eu-west-1_Iryvgiv7P", // example: 'us-east-2_teEUQbkUh'
    userPoolWebClientId: "13qhut4o8n11g6bd9qiiv4atfu", // example: '3k09ptd8kn8qk2hpk07qopr86'
  },
  API: {
    endpoints: [
      {
        name: "WildRydesAPI",
        endpoint: "", // example: 'https://u8swuvl00f.execute-api.us-east-2.amazonaws.com/prod'
        region: "", // example: 'us-east-2'
      },
    ],
  },
  Storage: {
    bucket: "", //example: 'wildrydesbackend-profilepicturesbucket-1wgssc97ekdph'
    region: "", // example: 'us-east-2'
  },
};

export default awsConfig;
