// Netlify Function: health-deploy
// Responds with a lightweight deploy-only health check (no DB call)

exports.handler = async (event, context) => {
  const payload = {
    status: 'deployed',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || process.env.SITE_VERSION || null,
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // adjust as needed for production
    },
    body: JSON.stringify(payload),
  };
};
