const menuModel = require('../models/menu.model');

// 🔥 In-memory cache (VERY IMPORTANT)
let MENU_CACHE = null;

/**
 * GET /api/menu
 * Fetch all menu items (cached)
 */
exports.getMenu = async (req, res) => {
  try {
    // ✅ Serve from cache if exists (FAST)
    if (MENU_CACHE) {
      return res.status(200).json({
        success: true,
        data: MENU_CACHE,
        cached: true
      });
    }

    // ❌ DB hit only once
    const menuItems = await menuModel.getAllMenuItems();

    // 🔥 Save to memory
    MENU_CACHE = menuItems;

    res.status(200).json({
      success: true,
      data: menuItems,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items'
    });
  }
};
