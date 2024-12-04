const axios = require("axios");

const sendMessage = async (WA_API, phoneNumber, message) => {
  try {
    const response = await axios.post(WA_API, {
      message,
      phoneNumber,
    });

    return response.data;
  } catch (error) {
    console.error("Error wa service", error);
  }
};

module.exports = {
  sendMessage,
};
