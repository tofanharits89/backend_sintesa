// controllers/vectaraController.js
import axios from "axios";

export const queryVectara = async (req, res) => {
  const { query } = req.body; // Get the query from the request body

  try {
    const response = await axios.post(
      "https://api.vectara.io/v2/corpora/corpuspdpsipa/query",
      {
        query,
        // Add any other necessary parameters here
      },
      {
        headers: {
          corpus_key: "corpuspdpsipa",
          "x-api-key": "zwt_6PShxTV6GRg0oIBLggy_HlO9FSOAaP3HHntKdQ",
          "Content-Type": "application/json",
        },
      }
    );

    // Return the API response to the frontend
    return res.json(response.data);
  } catch (error) {
    console.error("Error querying Vectara API:", error.message);
    return res.status(500).json({ error: "Failed to query Vectara API" });
  }
};
