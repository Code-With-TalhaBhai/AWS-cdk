import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsManager from 'aws-cdk-lib/aws-secretsmanager';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Duration } from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';


export class RotateSecretLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secret = new secretsManager.Secret(this,'RotateSecret',{
      secretName: 'rotate_secret',
      generateSecretString:{
        secretStringTemplate: JSON.stringify({
          username: 'talha',
          dbName: 'MyRDSdatabase',
          password: 'nfeiw@fjds7&fd2',
          port: '9098',
          region: 'us-east-1'
        }),
        generateStringKey: 'MyRotateSecret'
      }
    })
    
    // This will rotate after 24 hours
    const lambdaFunc = new lambda.Function(this,'MyRotateLambda',{
      functionName: 'MyRotateLambdaFunction',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment:{
        'OurRotationSecret': `${secretsManager.Secret.fromSecretNameV2(this,'rotationSecretId',secret.secretName).secretValue.unsafeUnwrap()}`,
        'my_region': cdk.Stack.of(this).region,
        'secret_key': secret.secretValueFromJson('MyRotateSecret').unsafeUnwrap(),
        'secret_name': secret.secretName
      }
    });

    // secret.grantRead(lambdaFunc);
    // secret.grantWrite(lambdaFunc);

    lambdaFunc.grantInvoke(new iam.ServicePrincipal('secretsmanager.amazonaws.com'))
    lambdaFunc.addToRolePolicy(new iam.PolicyStatement({
      resources: [secret.secretArn],
      actions: ['secretsmanager:PutSecretValue']
    }))



    secret.addRotationSchedule('addRotationSchedule',{
      rotationLambda: lambdaFunc,
      automaticallyAfter: Duration.days(30)
    })
    
  }
}
