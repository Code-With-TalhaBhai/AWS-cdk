import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'

export class Step047Ec2InstancesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const vpc = new ec2.Vpc(this,'my-vpc',{
        ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
        subnetConfiguration:[
          {
            // Simple Private IP connect to other IP'S within same vpc 
            "cidrMask": 24,
            "name": "private-isolated-subnet",
            "subnetType": ec2.SubnetType.PRIVATE_ISOLATED
          },
          {
            // Assign Public IP Address, then we can access it through the Internet(RDP)
            cidrMask: 24,
            name: 'public-subnet',
            subnetType: ec2.SubnetType.PUBLIC 
          },
          // {
          //   // Private Ip with Nat-Gateway(HIGHLY PAID service)
          //   cidrMask: 24,
          //   name: 'private-subnet',
          //   subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS 
          // }
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

    security_group.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.allTraffic())

    // These keys would be saved in AWS SSM(Parameter Store). Copy and make `.pem` file and then decrypt from AWS-EC2-CONNECT or Puttygen
    const key_pair = new ec2.KeyPair(this,'key-pair1',{
      keyPairName : 'cdk-key-pair1',
      format: ec2.KeyPairFormat.PEM,// test-key-pair already created only for remember
    })

    const key_pair2 = new ec2.KeyPair(this,'key-pair2',{
      keyPairName: 'cdk-key-pair2',
      format: ec2.KeyPairFormat.PPK
    })

    // const awsAMI = new ec2.AmazonLinuxImage({generation:ec2.AmazonLinuxGeneration.AMAZON_LINUX_2})
    // const awsAMI = new ec2.MachineImage({generation:ec2.AmazonLinuxGeneration.AMAZON_LINUX_2})

    new ec2.Instance(this,'cdk-instance1',{
      vpc,
      instanceName: 'cdk-created-instance',
      keyName: key_pair.keyPairName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2,ec2.InstanceSize.MICRO), // Using t2 micro included in free tier
      machineImage: ec2.MachineImage.latestWindows(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_STIG_CORE),
      securityGroup: security_group,
      vpcSubnets:{
        subnetGroupName: 'public-subnet'
      }
    })

    new ec2.Instance(this,'cdk-instance2',{
      vpc,
      instanceName: 'cdk-created-instance2',
      keyName: key_pair2.keyPairName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2,ec2.InstanceSize.MICRO), // Using t2 micro included in free tier
      machineImage: ec2.MachineImage.latestWindows(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_STIG_CORE),
      securityGroup: security_group,
      vpcSubnets:{
        subnetGroupName: 'private-isolated-subnet'
      }
    })

    // cdk_key_pair_name
  }
}