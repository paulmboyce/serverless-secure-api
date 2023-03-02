import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  UserPool,
  UserPoolProps,
  AdvancedSecurityMode,
  UserPoolClientOptions,
  UserPoolClientIdentityProvider,
  AuthFlow,
} from "aws-cdk-lib/aws-cognito";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Cognito User Pool with Email Sign-in Type.
    const userPoolProps: UserPoolProps = {
      userPoolName: "WildRides",
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
      advancedSecurityMode: AdvancedSecurityMode.OFF,
      //  keepOriginal: { email: true, phone: true },
    };

    const userPool = new UserPool(this, "WildRides", userPoolProps);

    const clientauthFlows: AuthFlow = {
      userPassword: true,
      userSrp: true,
    };

    const clientParams: UserPoolClientOptions = {
      userPoolClientName: "wildrydes-web-app",
      authFlows: clientauthFlows,
      // ...
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
    };
    const client = userPool.addClient("wildrydes-web-app", clientParams);

    new cdk.CfnOutput(this, "UserPool ID", { value: userPool.userPoolId });
    new cdk.CfnOutput(this, "UserPool ARN", { value: userPool.userPoolArn });
    new cdk.CfnOutput(this, "UserPool CLIENT ID", {
      value: client.userPoolClientId,
    });
  }
}
