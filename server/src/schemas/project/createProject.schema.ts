import z from "zod";

const createProjectSchema = z.object({
    name: z
        .string({
            required_error: "Please provide project name.",
            invalid_type_error: "Project name must be a string.",
        })
        .min(3, { message: "Project name must be atleast 3 characters long." })
        .max(32, { message: "Project name cannot exceed 32 characters." })
        .trim(),
});

export { createProjectSchema };
