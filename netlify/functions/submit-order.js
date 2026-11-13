
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { network, bundle, phone, transaction, price } =
      JSON.parse(event.body || "{}");

    if (!network || !bundle || !phone || !transaction || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Please complete all order details." })
      };
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Order notification is not configured yet." })
      };
    }

    const reference = "GFD-" + Date.now();

    const message =
      "NEW GRACE FAST DATA ORDER\n\n" +
      "Reference: " + reference + "\n" +
      "Network: " + network + "\n" +
      "Bundle: " + bundle + "\n" +
      "Price: GH₵" + price + "\n" +
      "Customer phone: " + phone + "\n" +
      "MoMo transaction code: " + transaction + "\n\n" +
      "Status: Awaiting manual payment verification.";

    const telegramResponse = await fetch(
      "https://api.telegram.org/bot" + token + "/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      throw new Error("Telegram notification failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        reference: reference
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Order submission failed." })
    };
  }
};
