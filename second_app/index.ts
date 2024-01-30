import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

// Create an AWS S3 bucket for our frontend react project
const siteBucket = new aws.s3.Bucket('siteBucket', {
    website: {
        indexDocument: 'index.html', // Assuming index.html will be the entry point for the React app
    },
});

// Upload the built React application to the S3 bucket
const siteRoot = new aws.s3.BucketObject('siteRoot', {
    bucket: siteBucket,
    source: new pulumi.asset.FileAsset('./build'), // Path to the React build directory
    contentType: 'text/html', // Assuming the main file is HTML
    key: 'index.html', // Key for the entry point file
});

// Provision CloudFront to serve content from the S3 bucket
const cdn = new aws.cloudfront.Distribution('siteDistribution', {
    origins: [{
        domainName: siteBucket.bucketRegionalDomainName,
        originId: siteBucket.id,
    }],
    enabled: true,
    isIpv6Enabled: true,
    comment: "Frontend React Project CDN",
    defaultRootObject: 'index.html',
    defaultCacheBehavior: {
        allowedMethods: ["GET", "HEAD"],
        cachedMethods: ["GET", "HEAD"],
        targetOriginId: siteBucket.id,
        forwardedValues: {
            queryString: false,
            cookies: {
                forward: 'none',
            },
        },
        viewerProtocolPolicy: 'redirect-to-https',
        minTtl: 0,
        defaultTtl: 3600,
        maxTtl: 86400,
    },
    priceClass: 'PriceClass_All',
    customErrorResponses: [{
        errorCode: 404,
        responsePagePath: '/index.html',
        responseCode: 200,
        errorCachingMinTtl: 300,
    }],
    restrictions: {
        geoRestriction: {
            restrictionType: 'none',
        },
    },
    viewerCertificate: {
        cloudfrontDefaultCertificate: true,
    },
});

const bucketPolicy = new aws.s3.BucketPolicy('bucketPolicy', {
    bucket: siteBucket.id,
    policy: siteBucket.arn.apply(arn => JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: [`${arn}/*`], // Policy to allow public read of all objects in bucket
        }],
    })),
});

// Export the names of the bucket and CloudFront distribution
export const bucketName = siteBucket.id;
export const cdnUrl = cdn.domainName;