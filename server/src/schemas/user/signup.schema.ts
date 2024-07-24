import validator from "validator";
import z from "zod";

const signupSchema = z.object({
    name: z
        .string({
            required_error: "Please provide your name.",
            invalid_type_error: "Your name must be a string.",
        })
        .min(3, { message: "Your name must be atleast 3 characters long." })
        .max(32, { message: "Your name cannot exceed 32 characters." })
        .trim(),
    username: z
        .string({
            required_error: "Please provide your username.",
            invalid_type_error: "Username must be a string.",
        })
        .min(3, { message: "Username must be atleast 3 characters long." })
        .max(32, { message: "Username cannot exceed 32 characters." })
        .trim()
        .toLowerCase(),
    email: z
        .string({
            required_error: "Please provide your email.",
            invalid_type_error: "Email must be a string.",
        })
        .email({ message: "Please provide a valid email address." })
        .toLowerCase(),
    password: z
        .string({
            required_error: "Please provide your password.",
            invalid_type_error: "Password must be a string.",
        })
        .refine(validator.isStrongPassword, {
            message:
                "Password must be atleast 8 characters long. It must include at least one uppercase letter, one lowercase letter, one digit and one special character.",
        }),
});

export { signupSchema };
