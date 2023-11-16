import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Step047Ec2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const vpc = new ec2.Vpc(this,'my-vpc',{
        ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
        subnetConfiguration:[
          {
            "cidrMask": 24,
            "name": "private-isolated-subnet",
            "subnetType": ec2.SubnetType.PRIVATE_ISOLATED // Simple Private ip connect to other ips within vpc 
          },
          {
            cidrMask: 24,
            name: 'public-subnet',
            subnetType: ec2.SubnetType.PUBLIC // cannot sure about it maybe, enable ELASTIC IP(paid)--> in testing
          },
          {
            cidrMask: 24,
            name: 'private-subnet',
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS // Private Ip with Nat-Gateway(HIGHLY PAID service)
          }
        ]
    })


    const security_group = new ec2.SecurityGroup(this,'sg-cdk',{
      'securityGroupName': 'cdk-security-group',
      'vpc': vpc,
      'allowAllOutbound': true
    });


    // Inbound Traffic
    security_group.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.tcp(22),'Used for ssh')

    security_group.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.tcp(80),'Used for http') // Allow outbound http
    // security_group.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.tcp(443),'Used for https') // Allow outbound https

    const key_pair = new ec2.CfnKeyPair(this,'vscode-key-pair',{
      keyName: 'cdk-key-pair'
    })

    const awsAMI = new ec2.AmazonLinuxImage({generation:ec2.AmazonLinuxGeneration.AMAZON_LINUX_2})

    new ec2.Instance(this,'cdk-instance',{
      vpc,
      instanceName: 'cdk-created-instance',
      keyName: key_pair.keyName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2,ec2.InstanceSize.MICRO), // Using t2 micro included in free tier
      machineImage: awsAMI,
      securityGroup: security_group
    })

    // cdk_key_pair_name



  }
}
