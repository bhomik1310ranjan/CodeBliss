import { z } from "zod";

const signinSchema = z.object({
    identifier: z.string({
        required_error: "Please provide your username or email.",
        invalid_type_error: "Username or Email must be a string.",
    }),
    password: z.string({
        required_error: "Please provide your password.",
        invalid_type_error: "Password must be a string.",
    }),
});

export { signinSchema };
