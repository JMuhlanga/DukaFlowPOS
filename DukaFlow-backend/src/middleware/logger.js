module.exports = (req, res, next) => {
    const start = Date.now();
  
    console.log(`➡️  [Request] ${req.method} ${req.originalUrl}`);
    if (Object.keys(req.body).length) {
      console.log(`   Body: ${JSON.stringify(req.body)}`);
    }
    if (Object.keys(req.query).length) {
      console.log(`   Query: ${JSON.stringify(req.query)}`);
    }
  
    // Hook into res.json to log success/failure message
    const originalJson = res.json;
    res.json = function (data) {
      let logMsg = '';
      if (data && typeof data === 'object') {
        // Check for 'success' and conditionally handle message
        const success = data.success !== undefined ? data.success : 'N/A';
       
        if (success === true) {
          // For success, just log success status - message has been rendered on client
          logMsg = `⬅️  [Response] ${res.statusCode} | success: true (message rendered on client)`;
        } else {
          // For failure, include the message for logging
          const message = data.message || data.msg || '';
          logMsg = `⬅️  [Response] ${res.statusCode} | success: false | message: "${message}"`;
        }
      } else {
        logMsg = `⬅️  [Response] ${res.statusCode} | data not an object`;
      }
  
      console.log(logMsg);
      console.log(`⏱  Response Time: ${Date.now() - start}ms`);
  
      originalJson.apply(res, arguments);
    };
  
    next();
  };
  