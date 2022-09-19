#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Step012GrantIamPoliciesToResourceStack } from '../lib/step_012_grant_iam_policies_to_resource-stack';

const app = new cdk.App();
new Step012GrantIamPoliciesToResourceStack(app, 'Step012GrantIamPoliciesToResourceStack', {


});