
import axiosClient from "../redux/APIs/axios";


// [GET]
const getRequest = async (url) => {
  try {
    const res = await axiosClient.get(`${url}`);
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

// [GET] -> params
const getRequestParams = async (url, params) => {
  try {
    const res = await axiosClient.get(`${url}`, { params });
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

// [POST]
const postRequest = async (url, payload) => {
  try {
    const res = await axiosClient.post(`${url}`, payload);
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

// [POST] -> multipart/form-data
const postRequestFormData = async (url, payload) => {
  try {
    const res = await axiosClient.post(`${url}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

// [DELETE]
const deleteRequest = async (url, payload) => {
  try {
    const res = await axiosClient.delete(`${url}`, { data: payload });
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

// [PUT]
const putRequest = async (url, payload) => {
  try {
    const res = await axiosClient.put(`${url}`, payload);
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

// [PUT] -> params
const putRequestParams = async (url, params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    const res = await axiosClient.put(fullUrl, null);
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

// [PUT] -> multipart/form-data
const putRequestFormData = async (url, payload) => {
  try {
    const res = await axiosClient.put(`${url}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

// [PATCH]
const patchRequest = async (url, payload) => {
  try {
    const res = await axiosClient.patch(`${url}`, payload);
    return res;
  } catch (error) {
    return error.response ? error.response : { data: { message: error.message } };
  }
};

export {
  getRequest,
  getRequestParams,
  postRequest,
  deleteRequest,
  putRequest,
  patchRequest,
  postRequestFormData,
  putRequestParams,
  putRequestFormData,
};