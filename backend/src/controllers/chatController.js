// Removed AI imports to prevent crashes

export const handleChat = async (req, res) => {
  // Return a static message if the frontend accidentally calls this
  res.json({ reply: "The AI assistant is currently disabled." });
};