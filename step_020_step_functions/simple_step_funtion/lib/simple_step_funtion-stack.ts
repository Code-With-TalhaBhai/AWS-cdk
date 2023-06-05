import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs';
// import { Role } from 'aws-cdk-lib/aws-iam';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as aws_sf from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SimpleStepFuntionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this,'dynamo-role',
    {
      roleName: 'custom-dynamo-full',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      actions: ['dynamodb:*','logs:*'],
      resources: ['arn:aws:dynamodb:*']
    }))
    


    const fn1 = new lambda.Function(this,'Step-first-function',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dynamo.handler',
      code: lambda.Code.fromAsset('lambdas'),
      role: role,
      environment:{
        table_name : 'myschemaTable'
      }
    });


    const fn2 = new lambda.Function(this,'Step-second-function',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'message.handler',
      code: lambda.Code.fromAsset('lambdas')
    });


    const firstStep = new tasks.LambdaInvoke(this,'first-lambda-step',{
      lambdaFunction: fn1
    });

    const secondStep = new tasks.LambdaInvoke(this,'second-lambda-invoke',{
      lambdaFunction: fn2,
      inputPath: "$.Payload"
    });


    const chain = aws_sf.Chain.start(firstStep).next(secondStep);

    new aws_sf.StateMachine(this,'simpleStateMachine',{
      definition: chain
    })

    
  }
}
