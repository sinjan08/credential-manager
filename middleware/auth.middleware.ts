import { verifyAccessToken } from "@/config/jwt.config";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

/**
 * Auth middleware wrapper (FIXED)
 */
export const withAuth = (
  handler: (
    req: AuthenticatedRequest,
    context: { params: Promise<{ id: string }> }
  ) => Promise<Response>
) => {
  return async (
    req: AuthenticatedRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    try {
      const authHeader = req.headers.get("authorization");

      // ❌ Missing token
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Unauthorized: Authentication token is missing.",
          }),
          { status: 401 }
        );
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = verifyAccessToken(token);

        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
        };

        // 🔥 MUST forward context exactly
        return handler(req, context);

      } catch {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Unauthorized: Invalid or expired token.",
          }),
          { status: 401 }
        );
      }

    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized: Please log in to access this resource.",
        }),
        { status: 401 }
      );
    }
  };
};