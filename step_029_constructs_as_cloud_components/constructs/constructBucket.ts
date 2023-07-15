import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import * as s3_notify from 'aws-cdk-lib/aws-s3-notifications';


export interface BucketProps {
    prefix?: string
}



export class constructBucket extends cdk.Stack{
    public readonly topic: sns.Topic;

    constructor(scope:Construct,id:string,props:BucketProps){
        super(scope,id);

            const bucket = new s3.Bucket(this,'construct_bucket',{
                bucketName: 'construct-s3-bucket',
            });

            this.topic = new sns.Topic(this,'sns-construct-topic',{
                topicName: 'Construct-topic'
            });

            // const topic = new Topic(this,'sfjskd');
            const notifyTopic = new s3_notify.SnsDestination(this.topic);

            // bucket.addEventNotification(s3.EventType.OBJECT_CREATED,notifyTopic);
            bucket.addObjectCreatedNotification(notifyTopic,{
                prefix: props.prefix
            })

    }
}