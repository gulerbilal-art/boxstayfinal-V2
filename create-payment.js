const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: headers, body: "Method Not Allowed" };

  try {
    var pi = await stripe.paymentIntents.create({
      amount: 5900,
      currency: "eur",
      description: "Box Surprise",
      automatic_payment_methods: { enabled: true },
      metadata: { boxCode: "742", boxDescription: "Box Surprise" }
    });

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        clientSecret: pi.client_secret,
        amount: 5900,
        description: "Box Surprise",
        code: "742"
      })
    };
  } catch(err) {
    return { statusCode: 500, headers: headers, body: JSON.stringify({ error: err.message }) };
  }
};
