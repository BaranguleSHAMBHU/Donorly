import Organization from "../models/Organization.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new Organization
// @route   POST /api/org/register
export const registerOrg = async (req, res) => {
  const { orgName, email, phone, orgType, licenseNumber, address, password } = req.body;

  try {
    const orgExists = await Organization.findOne({ email });

    if (orgExists) {
      return res.status(400).json({ message: "Organization already registered" });
    }

    const organization = await Organization.create({
      orgName,
      email,
      phone,
      orgType,
      licenseNumber,
      address,
      password,
    });

    res.status(201).json({
      organization: {
        _id: organization._id,
        orgName: organization.orgName,
        email: organization.email,
        role: organization.role,
      },
      token: generateToken(organization._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth Organization & get token
// @route   POST /api/org/auth/login
export const loginOrg = async (req, res) => {
  const { email, password } = req.body;

  try {
    const organization = await Organization.findOne({ email });

    if (organization && (await organization.matchPassword(password))) {
      res.json({
        organization: {
          _id: organization._id,
          orgName: organization.orgName,
          email: organization.email,
          role: organization.role,
        },
        token: generateToken(organization._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
