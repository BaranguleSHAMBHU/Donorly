import Notification from '../models/Notification.js';
import Camp from '../models/Camp.js';

// @desc    Send Notification to Registered Donors of a Camp
// @route   POST /api/notifications/send-camp-alert
export const sendCampAlert = async (req, res) => {
  const { campId, message, type } = req.body;

  try {
    // 1. Find the camp and its registered donors
    const camp = await Camp.findById(campId);
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    if (camp.registeredDonors.length === 0) {
      return res.status(400).json({ message: "No donors registered for this camp yet." });
    }

    // 2. Create a notification for EACH registered donor
    const notifications = camp.registeredDonors.map(donorId => ({
      recipientId: donorId,
      message: message || `Reminder: The blood drive '${camp.campName}' is starting soon!`,
      type: type || 'reminder'
    }));

    await Notification.insertMany(notifications);

    res.json({ message: `Successfully notified ${notifications.length} donors!` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get My Notifications (For Donor)
// @route   GET /api/notifications
export const getMyNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 }); // Newest first
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Mark Notification as Read
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};