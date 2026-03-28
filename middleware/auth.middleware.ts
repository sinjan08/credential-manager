import { verifyAccessToken } from "@/config/jwt.config";
import { NextRequest } from "next/server";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

type RouteContext<T = Record<string, unknown>> = {
  params: Promise<T>;
};

export const withAuth = <T = Record<string, unknown>>(
  handler: (
    req: AuthenticatedRequest,
    context: RouteContext<T>
  ) => Promise<Response>
) => {
  return async (
    req: NextRequest,
    context: RouteContext<T>
  ): Promise<Response> => {
    try {
      const authHeader = req.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json(
          {
            success: false,
            message: "Unauthorized: Authentication token is missing.",
          },
          { status: 401 }
        );
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = verifyAccessToken(token);

        (req as AuthenticatedRequest).user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
        };

        return handler(req as AuthenticatedRequest, context);

      } catch {
        return Response.json(
          {
            success: false,
            message: "Unauthorized: Invalid or expired token.",
          },
          { status: 401 }
        );
      }

    } catch {
      return Response.json(
        {
          success: false,
          message: "Unauthorized: Please log in to access this resource.",
        },
        { status: 401 }
      );
    }
  };
};