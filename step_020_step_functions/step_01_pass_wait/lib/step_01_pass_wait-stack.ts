import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step01PassWaitStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    const pass = new sfn.Pass(this,'sfn-pass',{
      resultPath: '$.tr_time',
      result: sfn.Result.fromObject({time:3})
    });

    const wait = new sfn.Wait(this,'sfn-wait',{
      time: sfn.WaitTime.secondsPath('$.tr_time.time')
    });

    const chain = pass.next(wait);

    new sfn.StateMachine(this,'sfn-machine-passWait',{
      definition: chain
    })

    
  }
}
