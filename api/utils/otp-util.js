var unirest = require("unirest")

exports.fast2sms = async ({ otp, mobile }) => {
    var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
    req.query({
        "authorization": process.env.FAST_API,
        "sender_id": "ENTERA",
        "message": "135032",
        "variables_values": otp,
        "route": "dlt",
        "numbers": mobile,
    });

    req.headers({
        "cache-control": "no-cache"
    });

    req.end(function (result) {
        if (result.error) throw new Error(result.error);
        console.log(result.body);
    });
}