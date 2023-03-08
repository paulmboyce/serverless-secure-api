import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  UserPool,
  UserPoolProps,
  AdvancedSecurityMode,
  UserPoolClientOptions,
  UserPoolClientIdentityProvider,
  AuthFlow,
  UserPoolDomain,
  UserPoolDomainProps,
  UserPoolDomainOptions,
  OAuthSettings,
} from "aws-cdk-lib/aws-cognito";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

import {
  IdentityPool,
  IdentityPoolProps,
  UserPoolAuthenticationProvider,
} from "@aws-cdk/aws-cognito-identitypool-alpha";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
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

    const domainProps: UserPoolDomainOptions = {
      cognitoDomain: {
        domainPrefix: "wild-rides-oauth2",
      },
    };

    const userPoolDomain: UserPoolDomain = userPool.addDomain(
      "userPoolDomain",
      domainProps
    );

    const clientauthFlows: AuthFlow = {
      userPassword: true,
      userSrp: true,
    };

    // NOTE: These are in fact the default settings, but
    // made explicit here in case we want to customise.
    const oAuthSettings: OAuthSettings = {
      flows: {
        authorizationCodeGrant: true,
        implicitCodeGrant: true,
        clientCredentials: false,
      },
    };

    const clientParams: UserPoolClientOptions = {
      userPoolClientName: "wildrydes-web-app",
      authFlows: clientauthFlows,
      // ...
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
      oAuth: oAuthSettings,
    };
    const client = userPool.addClient("wildrydes-web-app", clientParams);

    const identityPoolProps: IdentityPoolProps = {
      identityPoolName: "wildrydes_identity_pool",
      authenticationProviders: {
        userPools: [
          new UserPoolAuthenticationProvider({
            userPool: userPool,
            userPoolClient: client,
          }),
        ],
      },
      allowClassicFlow: false,
      allowUnauthenticatedIdentities: false,
    };

    const identityPool = new IdentityPool(
      this,
      "myIdentityPool",
      identityPoolProps
    );

    //Add permissions to Authenticated Users role
    identityPool.authenticatedRole.addToPrincipalPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:*"],
        resources: ["*"],
      })
    );

    new CfnOutput(this, "UserPool ID", { value: userPool.userPoolId });
    new CfnOutput(this, "UserPool ARN", { value: userPool.userPoolArn });
    new CfnOutput(this, "UserPool Domain", {
      value: userPoolDomain.domainName,
    });
    new CfnOutput(this, "UserPool Domain BASE URL", {
      value: userPoolDomain.baseUrl(),
    });

    new CfnOutput(this, "UserPool CLIENT ID", {
      value: client.userPoolClientId,
    });
    new CfnOutput(this, "IdentiyPool Name", {
      value: identityPool.identityPoolName,
    });
    new CfnOutput(this, "IdentiyPool ID", {
      value: identityPool.identityPoolId,
    });
  }
}
