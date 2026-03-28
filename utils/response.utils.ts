type ApiResponseType<T> = {
    success: boolean;
    message: string;
    data?: T;
};

export class ApiResponse {
    static success<T>(
        message: string = "Success",
        data?: T,
        code: number = 200
    ) {
        const response: ApiResponseType<T> = {
            success: true,
            message,
            ...(data !== undefined && { data }),
        };

        return new Response(JSON.stringify(response), {
            status: code,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    static error<T = null>(
        message: string = "Something went wrong",
        code: number = 400,
        data?: T
    ) {
        const response: ApiResponseType<T> = {
            success: false,
            message,
            ...(data !== undefined && { data }),
        };

        return new Response(JSON.stringify(response), {
            status: code,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    static validation(
        error: unknown,
        code: number = 422
    ) {
        let message = "Validation error";

        // Safe type narrowing
        if (
            typeof error === "object" &&
            error !== null &&
            "errors" in error &&
            Array.isArray((error as { errors: { message?: string }[] }).errors)
        ) {
            message =
                (error as { errors: { message?: string }[] }).errors[0]?.message ||
                message;
        } else if (typeof error === "string") {
            message = error;
        }

        const response: ApiResponseType<null> = {
            success: false,
            message,
        };

        return new Response(JSON.stringify(response), {
            status: code,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}