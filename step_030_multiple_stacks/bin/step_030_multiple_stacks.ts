#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { backendStack, frontendStack } from '../lib/step_030_multiple_stacks-stack';

const app = new cdk.App();

new backendStack(app, 'backendfromMultiStack');
new frontendStack(app, 'frontendfromMultiStack');