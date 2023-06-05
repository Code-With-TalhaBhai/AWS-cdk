import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

export class Step05MapStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const initialState = new sfn.Pass(this,'initial_passes',{
      result: sfn.Result.fromArray(["entry1","entery2","entery3"]),
      resultPath: '$.Array_Result'
    })

    const chain_map  = new sfn.Map(this,'Map_Chain',{
      maxConcurrency: 1,
      itemsPath: sfn.JsonPath.stringAt('$.Array_Result')
    });

    const pass1 = new sfn.Pass(this,'map_pass_1');

    chain_map.iterator(pass1);

    const chain = initialState.next(chain_map);

    const state_machine = new sfn.StateMachine(this,'map_machine',{
      definition: chain
    })

    
  }
}
