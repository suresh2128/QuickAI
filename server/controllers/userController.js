import sql from "../config/db.js";

// Get all creations of the authenticated user
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations = await sql`
      SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.messhage });
  }
};

// Get all published creations
export const getPublishCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle like/unlike on a creation
export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // ✅ Fetch creation with "likes" column
    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id}
    `;

    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((uid) => uid !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;

    // ✅ Update likes
    await sql`
      UPDATE creations 
      SET likes = ${formattedArray}::text[] 
      WHERE id = ${id}
    `;

    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

