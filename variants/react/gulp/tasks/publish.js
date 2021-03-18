const gulp = require('gulp');
const rename = require('gulp-rename');
const awspublish = require('gulp-awspublish');
const AWS = require('aws-sdk');
const config = require('../config');
const logger = require('../logger');

/** Verifies env config is correctly provided */
const verifyEnvConfig = (targetEnv) => {
  const envs = ['staging', 'production'];

  const messages = {
    noTarget: 'Cannot publish. No target environment provided!',
    noConfig: 'Cannot publish. No target configuration provided!',
    noBucket: 'Cannot publish. No bucket name provided!',
  };

  // Verify target provided
  if (!targetEnv || !envs.includes(targetEnv)) {
    logger.error(messages.noTarget);
    return false;
  }

  // Verify target config provided
  const targetConfig = config.awsS3[targetEnv];
  if (!targetConfig || typeof targetConfig !== 'object') {
    logger.error(messages.noConfig);
    return false;
  }

  // Verify bucket name provided
  const { bucket } = targetConfig;
  if (!bucket || typeof bucket !== 'string') {
    logger.error(messages.noBucket);
    return false;
  }

  logger.info(`Publishing build to ${bucket} S3 bucket`, 'blue.bold');
  return true;
};

/** Returns aws configuration object to use for awspublish.create */
const getS3EnvConfig = (targetEnv) => {
  if (!verifyEnvConfig(targetEnv)) return null;

  const awsEnvConfig = config.awsS3[targetEnv];
  const { profile, region, bucket, prefix, headers } = awsEnvConfig;

  return {
    prefix: prefix || '/dev',
    headers: headers || {},
    publishOpts: {
      region,
      params: {
        Bucket: bucket,
      },
      credentials: new AWS.SharedIniFileCredentials({ profile }),
      httpOptions: {
        timeout: 300000, // five minutes
      },
    },
  };
};

/** Publishes dist to AWS */
const publishClient = (targetEnv, done) => {
  const s3EnvConfig = getS3EnvConfig(targetEnv);

  // Ensure aws config exists
  if (s3EnvConfig === null) {
    logger.error(`Failed to publish ${targetEnv}`);
    done();
  }

  const { prefix = '/dev', headers, publishOpts } = s3EnvConfig;

  // Create publisher with S3 options
  const publisher = awspublish.create(publishOpts);

  // Helper to add prefix to paths
  const prefixSource = p => rename((path) => {
    /* eslint-disable no-param-reassign */
    path.dirname = `${p}/${path.dirname}`;
  });

  return gulp.src(config.dist)
    .pipe(prefixSource(prefix))
    .pipe(awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync(prefix))
    .pipe(awspublish.reporter({
      states: ['create', 'update', 'delete', 'cache', 'skip'],
    }));
};

/** Publish build to staging bucket */
const publishStage = done => publishClient('staging', done);

/** Publish build to production bucket */
const publishProd = done => publishClient('production', done);

exports.publishStage = publishStage;
exports.publishProd = publishProd;
