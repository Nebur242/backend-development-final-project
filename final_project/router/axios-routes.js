const express = require("express");
const { default: axios } = require("axios");

const router = express.Router();

const BASE_URL = "http://localhost:3000";

router.get("/", async (_req, res) => {
  try {
    const { data, status } = await axios.get(BASE_URL);
    return res.status(status).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Server Error" });
  }
});

router.get("/isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;
  return axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then(({ status, data }) => {
      return res.status(status).json(data);
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: "Server Error" });
    });
});

router.get("/author/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const { data, status } = await axios.get(`${BASE_URL}/author/${author}`);
    return res.status(status).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Server Error" });
  }
});

router.get("/title/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const { data, status } = await axios.get(`${BASE_URL}/title/${title}`);
    return res.status(status).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Server Error" });
  }
});

module.exports.axiosRouter = router;
