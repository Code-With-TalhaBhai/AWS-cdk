import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as sfn_tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement, Role,ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Fail, Pass } from 'aws-cdk-lib/aws-stepfunctions';

export class Step02ChoicePart1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // const role = new Role(this,'myrole',{
    //   assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    // });

    // role.addToPolicy(new PolicyStatement({
    //   resources: ['dynamodb:*'],
    //   actions: ['dynamodb:*','logs:*'],
    //   effect: Effect.ALLOW
    // }));


     const lambdaFn = new lambda.Function(this,'choice-stack',{
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambdas'),
      handler: 'dynamo.handler',
      role: Role.fromRoleArn(this,'lambda-fetch-role','arn:aws:iam::706908112492:role/lambda_dynamo_full'),
      environment:{
        table_name : 'myschemaTable'
      }
     });

     const lambdaInvoke = new sfn_tasks.LambdaInvoke(this,'sfn-pass-taks',{
      lambdaFunction: lambdaFn,
      // outputPath: '$.firstFN'
     });

     const lambdaFn2 = new lambda.Function(this,'cfjdkls',{
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambdas'),
      handler: 'message.handler'
     });

     const lambdaInvoke2 = new sfn_tasks.LambdaInvoke(this,'sfn-pass-tasks2',{
      lambdaFunction: lambdaFn2,
      inputPath: '$.Payload',
      // outputPath: '$.final_ops'
     });

     const pass = new Pass(this,'We did it!',{
      resultPath: '$.result',
      result: sfn.Result.fromString('We Did It!')
     });

     const fail = new Fail(this,'job failed',{
      error: 'Job Failed',
      cause: 'Due to ID redundency'
     });


     const choice = new sfn.Choice(this,'Operation Successful?')
     .when(sfn.Condition.booleanEquals('$.Payload',true),pass)
     .when(sfn.Condition.booleanEquals('$.Payload',false),fail)

     const chain = lambdaInvoke.next(lambdaInvoke2).next(choice);


     const state_machine = new sfn.StateMachine(this,'choice-state-machine',{
      definition: chain,
     })

  }
}
