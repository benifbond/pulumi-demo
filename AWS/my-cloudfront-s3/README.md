
## Overview
This example demonstrates how to create a static website using [Pulumi](https://www.pulumi.com/). It utilizes an Amazon S3 bucket for file storage, configures the bucket to host a website, and deploys an Amazon CloudFront Distribution to serve the website with low latency, caching, and HTTPS. The template generates a complete Pulumi program, including placeholder web content.

## Getting Started
To get started with this example, follow the steps below:

### Prerequisites
1. Make sure you have [Pulumi](https://www.pulumi.com/docs/get-started/install/) installed on your local machine.
2. You will need an AWS account. Make sure you have your AWS credentials configured correctly.

### Installation
1. Create a new Pulumi project using the provided template:

   ```bash
   pulumi new static-website-aws-typescript
