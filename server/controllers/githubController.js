import axios from "axios";

export const searchGithubUsers = async (req, res) => {
  const { q, page = 1, per_page = 10 } = req.query;
  try {
    const response = await axios.get("https://api.github.com/search/users", {
      params: { q, page, per_page },
      headers: { "User-Agent": "SkipliApp" },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findGithubUserProfile = async (req, res) => {
  const { github_user_id } = req.query;
  try {
    const response = await axios.get(
      `https://api.github.com/user/${github_user_id}`,
      {
        headers: { "User-Agent": "SkipliApp" },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
