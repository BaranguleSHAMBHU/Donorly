import jwt from 'jsonwebtoken';
import Donor from '../models/Donor.js';
import Organization from '../models/Organization.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("🔹 1. Token Received:", token.substring(0, 20) + "..."); // DEBUG LOG

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔹 2. Decoded ID:", decoded.id); // DEBUG LOG

      // 1. Try finding user in Donor collection
      let user = await Donor.findById(decoded.id).select('-password');
      if (user) {
        console.log("🔹 3. Found User: DONOR");
      }

      // 2. If not found, try Organization collection
      if (!user) {
        user = await Organization.findById(decoded.id).select('-password');
        if (user) {
            console.log("🔹 3. Found User: ORGANIZATION", user._id);
        } else {
            console.log("❌ 3. User NOT found in Donor OR Org collections");
        }
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user; 
      next();
    } catch (error) {
      console.error("❌ Auth Error:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};