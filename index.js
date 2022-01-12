const dotenv = require('dotenv');

dotenv.config({ silent: true });

require('./jobs');
require('./server');
