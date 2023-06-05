import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Role } from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions'
import * as sfn_tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Choice, Pass } from 'aws-cdk-lib/aws-stepfunctions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step03ChoicePart2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      const lambdaFn = new lambda.Function(this,'choicep-2',{
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset('lambdas'),
        handler: 'dynamo.handler',
        role: Role.fromRoleArn(this,'lambda-fetch-role','arn:aws:iam::706908112492:role/lambda_dynamo_full'),
        environment:{
        table_name : 'My_Notes'
      }
      });

      const lambda_success = new lambda.Function(this,'internet',{
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset('lambdas'),
        handler: 'message1.handler',
      });

      const lambda_fail = new lambda.Function(this,'internetofapis',{
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset('lambdas'),
        handler: 'message2.handler',
      });


      const lambda_invo = new sfn_tasks.LambdaInvoke(this,'Invoke Note Lambda',{
        lambdaFunction: lambdaFn
      });

      const success = new sfn_tasks.LambdaInvoke(this,'Yes',{
        lambdaFunction: lambda_success
      });

      const fail = new sfn_tasks.LambdaInvoke(this,'NO',{
        lambdaFunction: lambda_fail
      });

      const otherPass = new Pass(this,'otherwise',{
        resultPath: '$.otherpass_path',
        result: sfn.Result.fromObject({result:'Otherwise Pass running'})
      });


      const afterPass = new Pass(this,'afterwards',{
        resultPath: '$.afterpass_path',
        result: sfn.Result.fromObject({after:'Afterwards pass running'})
      })

      const choice = new Choice(this,'Operational Procedures')
      .when(sfn.Condition.booleanEquals('$.Payload.operation_Accomplished',true),success)
      .when(sfn.Condition.booleanEquals('$.Payload.operation_Accomplished',false),fail)
      ;

      choice.otherwise(otherPass);

      choice.afterwards().next(afterPass);

      const chain = sfn.Chain.start(lambda_invo).next(choice);


      const state_machine = new sfn.StateMachine(this,'choice-p3',{
        definition: chain
      })


  }
}
