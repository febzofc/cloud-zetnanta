const rateLimitMap = new Map();

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 120; // 120 reqs/min

  let record = rateLimitMap.get(ip);
  if (!record || (now - record.startTime) > windowMs) {
    record = { count: 1, startTime: now };
    rateLimitMap.set(ip, record);
  } else {
    record.count += 1;
  }

  if (record.count > maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. API rate limit exceeded. Please try again in 1 minute.'
    });
  }

  next();
}
