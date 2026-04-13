'use strict';

exports.config = {
  app_name: ['agenda_02-IAST-Testing'],
  license_key: 'd2520e19ed51937c9306faad7c44a505b221NRAL',
  security: {
    enabled: true,
    agent: {
      enabled: true
    }
  },
  logging: {
    level: 'info',
    filepath: './newrelic.log'
  }
};