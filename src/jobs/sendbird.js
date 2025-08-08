import axios from 'axios';

const createUser = async (userId, username) => {
    const response = await axios.post(`${process.env.SENDBIRD_BASE_URL}/users`, {
        user_id: userId,
        nickname: username
    }, {
        headers: {
            "Api-Token": process.env.SENDBIRD_API_TOKEN,
            "Content-Type": "application/json"
        }
    });
    return response.data;
}

const createChannel = async (contractorId, providerId) => {
    const response = await axios.post(`${process.env.SENDBIRD_BASE_URL}/group_channels`, {
      user_ids: [contractorId, providerId],
      is_distinct: true
    }, {
      headers: {
        "Api-Token": process.env.SENDBIRD_API_TOKEN,
        "Content-Type": "application/json"
      }
    });
    return response.data;
}

export default {
    createUser,
    createChannel
};