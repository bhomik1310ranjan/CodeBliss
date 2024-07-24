import { Types } from "mongoose";
import z from "zod";

const updateProjectNameSchema = z.object({
    projectId: z
        .string({
            required_error: "Please provide project ID.",
            invalid_type_error: "Project ID must be a string.",
        })
        .refine((id) => Types.ObjectId.isValid(id), {
            message: "Please provide valid project ID.",
        }),
    newName: z
        .string({
            required_error: "Please provide project new name.",
            invalid_type_error: "Project new name must be a string.",
        })
        .min(3, { message: "Project name must be atleast 3 characters long." })
        .max(32, { message: "Project name cannot exceed 32 characters." })
        .trim(),
});

export { updateProjectNameSchema };
