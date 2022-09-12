import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as lambda from 'aws-cdk-lib/aws-lambda'

export class DefineUserpoolStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // const postAuthFn = new lambda.Function(this,'postAuthFn',{
    //   runtime: lambda.Runtime.NODEJS_16_X,
    //   code: lambda.Code.fromAsset('lambda'),
    //   handler: 'prefix.handler'
    // })

    const userPool = new cognito.UserPool(this, 'myusepool', {
      userPoolName: 'myFirstPool',
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Verify your email for Talha app!',
        emailBody: 'Thanks for signing up to TAlha AWS app! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing up to our awesome app! Your verification code is {####}',
      },
      signInAliases: {
        username: true,
        email: true,
      },
      autoVerify: { email: true},
      standardAttributes:{
        fullname: {
          required: true,
          mutable: false
        },
        email: {
          required: true,
          mutable: false
        }
      },
        customAttributes: {
        'myappid': new cognito.StringAttribute({ minLen: 5, maxLen: 15, mutable: true }),
        },
        passwordPolicy: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: false,
          requireDigits: true,
          requireSymbols: false,
          tempPasswordValidity: cdk.Duration.days(3),
        },
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        // lambdaTriggers: { //Custom lambda function for PostAuthentication (not manadatory)
        //   postAuthentication: postAuthFn,
        // },
    });


  }
}
