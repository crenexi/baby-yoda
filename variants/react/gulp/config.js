module.exports = {
  dist: './dist/**',
  awsS3: {
    staging: {
      profile: 's3-deploy',
      region: 'us-west-1',
      bucket: 'yoda',
      prefix: '/stage',
      headers: {
        'x-amz-acl': 'bucket-owner-full-control',
        'Cache-Control': 'public, no-transform, no-cache',
      },
    },
    production: {
      profile: 's3-deploy',
      region: 'us-west-1',
      bucket: 'yoda',
      prefix: '/prod',
      headers: {
        'x-amz-acl': 'bucket-owner-full-control',
        'Cache-Control': 'public, no-transform, max-age=3600',
      },
    },
  },
};
