/**
 * GLOBAL ERROR HANDLING MIDDLEWARE
 * Purpose: Application mein kahin bhi crash hone par ek standard response dena.
 */

/**
 * ============================================================
 * ERROR HANDLER (The Doctor)
 * ============================================================
 * @desc    Default Express error handling ko override karna.
 * @param   {Error} err - Jo error code mein throw kiya gaya hai.
 * @logic   Yeh middleware automatic trigger hota hai jab next(err) call ho.
 */
const errorHandler = (err, req, res, next) => {
    // 1. STATUS CODE LOGIC:
    // Agar route ne koi specific status code set kiya hai (jaise 404 ya 400), toh wahi lo.
    // Warna default 500 (Internal Server Error) set karo.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);

    // 2. RESPONSE BODY:
    // User ko clean message dena taaki frontend use handle kar sake.
    res.json({
        success: false,
        message: err.message, // Error ka asli kaaran (e.g. "Database connection failed")

        // 3. SECURITY & DEBUGGING (The Stack Trace):
        // Development mode mein humein 'stack' chahiye taaki pata chale error kis file ki kis line par hai.
        // Production mode mein 'stack' ko null kar dena zaroori hai taaki hackers ko code structure na mile.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

/**
 * EXPORT:
 * Ise 'server.js' mein sabse aakhiri route ke BAAD lagana zaroori hai.
 */
module.exports = { errorHandler };