exports.handler = async () => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return {
        statusCode: 500,
        body: "Bot token is not configured"
      };
    }

    const response = await fetch(
      "https://api.telegram.org/bot" + token + "/getUpdates"
    );

    const data = await response.json();

    if (!data.ok) {
      return {
        statusCode: 400,
        body: "Telegram could not retrieve updates. Check bot settings."
      };
    }

    const groups = data.result
      .filter(update => update.message?.chat?.type === "group" ||
                        update.message?.chat?.type === "supergroup")
      .map(update => ({
        chat_id: update.message.chat.id,
        group_name: update.message.chat.title
      }));

    return {
      statusCode: 200,
      body: JSON.stringify(groups)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Something went wrong"
    };
  }
};
