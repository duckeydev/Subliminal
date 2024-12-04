const axios = require("axios");

/**
 * Sends a message to a Discord channel via webhook.
 *
 * @param {string} webhookUrl - The URL of the Discord webhook.
 * @param {string} message - The message to send to the Discord channel.
 */
async function sendDiscordWebhook(webhookUrl, message) {
  // Prepare the payload
  const payload = {
    content: message,
  };

  try {
    const response = await axios.post(webhookUrl, payload);
    if (response.status === 204) {
      console.log("Message sent successfully.");
    } else {
      console.log("Failed to send message. Status code:", response.status);
    }
  } catch (error) {
    console.error("Error sending webhook:", error.message);
  }
}

module.exports = sendDiscordWebhook;
