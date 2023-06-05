import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions'
import { Fail, Pass } from 'aws-cdk-lib/aws-stepfunctions';

export class Step04ParallelStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const branch1 = new Pass(this,'parallel_branch_1',{
      result: sfn.Result.fromObject({welcome:'Hello and welcome from branch1',present:true})
      
    })

    const branch2 = new Pass(this,'parallel_branch_2',{
      result: sfn.Result.fromObject({welcome:'Hello and welcome from branch2',present:true})
    })

    const branch3 = new Pass(this,'parallel_branch_3',{
      result: sfn.Result.fromObject({welcome:'Hello and welcome from branch3',present:true})
    })

    const chain = new sfn.Parallel(this,'Branch Tree');

    chain.branch(branch1)
    .branch(branch2)
    .branch(branch3);

    const pass = new Pass(this,'success-branch',{
      result: sfn.Result.fromObject({result:'We have passed through branches'}),
    });

    const fail = new Fail(this,'fail-branch',{
      cause: 'Branches are not parsing',
      error: 'It must some type of branches issue'
    });

    // const choice = new sfn.Choice(this,'branch-choice')
    // .when(sfn.Condition.booleanEquals('$.Payload.present',true),pass)
    // .when(sfn.Condition.booleanEquals('$.Payload.present',false),fail)

    chain.addRetry({maxAttempts:1});

    chain.addCatch(fail);

    chain.next(pass);

    // chain.next(choice);
    
    const state_machine = new sfn.StateMachine(this,'parallel-stack',{
      definition: chain,
    })
    
  }
}
