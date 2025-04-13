const OTP = require("../models/OTP")

const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body

  try {
    const otpRecord = await OTP.findOne({ email })

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" })
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    // OTP is valid, delete it
    await OTP.deleteOne({ _id: otpRecord._id })

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { verifyOTP }
