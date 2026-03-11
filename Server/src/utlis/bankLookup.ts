import axios from "axios";

export const getBankName = async (routingNumber: string) => {

  try {

    const url = `https://www.routingnumbers.info/api/data.json?rn=${routingNumber}`;

    const response = await axios.get(url);

    if (response.data.code === 200) {
      return response.data.customer_name;
    }

    throw new Error("Invalid routing number");

  } catch (error) {

    throw new Error("Bank lookup failed");

  }

};