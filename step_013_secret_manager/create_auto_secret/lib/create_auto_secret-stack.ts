import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CreateAutoSecretStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const secret_1 = new secretsmanager.Secret(this,'myFirstSecret',{
    //   secretName: 'thi$i@g00d$ecret'
    // });

    const secret = new secretsmanager.Secret(this,'mySecret');

    const secret_2 = new secretsmanager.Secret(this,'mySecondSecret',{
      secretName: 'secondsecretname'
    });

    const secret_3 = new secretsmanager.Secret(this,'myThirdSecret',{
      secretName: 'thirdsecretname',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({username: 'mysql&mariadb'}),
        generateStringKey: 'mypassword'
      }
    })
    

    // Define role manually
    const role = new iam.Role(this, 'LambdaSecretRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        // assumedBy: new iam.AccountRootPrincipal(),
      });

      role.addToPolicy(new iam.PolicyStatement({
        resources: [secret.secretArn,secret_2.secretArn,secret_3.secretArn],
        actions: ['secretsmanger:*']
      }));

      // secret.grantRead(role);
      // secret.grantWrite(role);

      // iam.Role.fromRoleArn('jfkdsllkfds');

    // Lambda Secrets
    const lambdaFn = new lambda.Function(this,'SecretLambdaFn',{
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      role: role, // Manually role defining
      // role: iam.Role.fromRoleArn(this,'myroleArns','arn:aws:iam::706908112492:role/CreateAutoSecretStack-SecretLambdaFnServiceRoleBCC-1DF2E6CTMMI7Y'), // With Automaticall RoleArn
      environment:{
        // through ARN
        "Example_Secret_1": `${secretsmanager.Secret.fromSecretAttributes(this, "ImportedSecret", {
          secretCompleteArn: secret.secretArn
        }).secretValue.unsafeUnwrap()}`,

        // through Name
        'Example_Secret_2': `${secretsmanager.Secret.fromSecretNameV2(this,'examplekey2',secret_2.secretName).secretValue.unsafeUnwrap()}`,
        'Example_Secret_3': `${secretsmanager.Secret.fromSecretNameV2(this,'examplekey3',secret_3.secretName).secretValue.unsafeUnwrap()}`,
        'Example_Secret_4': `${cdk.SecretValue.secretsManager('github_aws').unsafeUnwrap()}`
      },
      handler: 'index.handler',
    });




    // lambdaFn.grantInvoke(new iam.ServicePrincipal('secretsmanager.amazonaws.com'));

    // lambdaFn.addToRolePolicy(new iam.PolicyStatement({
    //   resources: [secret_1.secretArn,secret_2.secretArn],
    //   actions: ['secretsmanager:*']
    // }))


    // const role = new iam.Role(this, 'LambdaIAMRole', {
    // //   // assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    //   assumedBy: new iam.AccountRootPrincipal(),
    // });

    // secret.grantRead(role);
    // secret.grantWrite(role);

  }
}
