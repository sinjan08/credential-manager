import { redis } from "@/config/redis.config";
import { AppError } from "@/utils/appError.utils";
import crypto from "crypto";

const OTP_PREFIX = "otp:";
const OTP_EXPIRY = 600; // 10 minutes
const OTP_LOCK = "otp_lock:";
const OTP_ATTEMPT = "otp_attempt:";

/**
 * Generate secure OTP
 */
const generateOTP = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Create & store OTP
 */
export const createOTP = async (identifier: string) => {
  try {
    // 🚫 Prevent spam (1 OTP per 60 sec)
    const lockKey = `${OTP_LOCK}${identifier}`;
    const isLocked = await redis.get(lockKey);

    if (isLocked) {
      throw new Error("Please wait before requesting another OTP");
    }

    const otp = generateOTP();

    // store OTP with expiry
    await redis.set(`${OTP_PREFIX}${identifier}`, otp, "EX", OTP_EXPIRY);

    // set lock (rate limit)
    await redis.set(lockKey, "1", "EX", 60);

    return otp;
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (
  identifier: string,
  userOtp: string
) => {
  try {
    const key = `${OTP_PREFIX}${identifier}`;
    const attemptKey = `${OTP_ATTEMPT}${identifier}`;

    const storedOtp = await redis.get(key);

    if (!storedOtp) {
      throw new Error("OTP expired or not found");
    }

    // 🔁 track attempts
    const attempts = await redis.incr(attemptKey);

    if (attempts === 1) {
      await redis.expire(attemptKey, OTP_EXPIRY);
    }

    if (attempts > 5) {
      throw new Error("Too many attempts. Try again later.");
    }

    if (storedOtp !== userOtp) {
      throw new Error("Invalid OTP");
    }

    // ✅ success → cleanup
    await redis.del(key);
    await redis.del(attemptKey);

    return true;
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};