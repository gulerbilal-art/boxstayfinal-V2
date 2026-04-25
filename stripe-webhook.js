const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    var sig = event.headers["stripe-signature"];
    var stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (stripeEvent.type === "payment_intent.succeeded") {
      var pi = stripeEvent.data.object;
      console.log("PAIEMENT OK - Code:", pi.metadata.boxCode, "- Montant:", pi.amount / 100, "EUR");
    }
  } catch(err) {
    return { statusCode: 400, body: "Webhook Error: " + err.message };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
