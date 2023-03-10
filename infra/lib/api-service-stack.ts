import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { Endpoint } from "aws-cdk-lib/aws-rds";
import { EndpointType } from "aws-cdk-lib/aws-apigateway";

export class ApiServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const helloLambda = new lambda.Function(this, "HelloHandler", {
      functionName: "ApiX_HelloHandler",
      runtime: lambda.Runtime.NODEJS_16_X, // execution environment
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
      handler: "hello.handler", // file is "hello", function is "handler"
    });

    // Add apiGateway lambda rest
    const api = new apigw.LambdaRestApi(this, "ApiServiceToLambda", {
      restApiName: "ApiServiceToLambda",
      handler: helloLambda,
      endpointTypes: [EndpointType.REGIONAL],
    });
    new CfnOutput(this, "Lambda ARN", {
      value: helloLambda.functionArn,
    });

    new CfnOutput(this, "Api URL", {
      value: api.url,
    });
  }
}
