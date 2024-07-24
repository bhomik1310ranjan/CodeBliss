import { Types } from "mongoose";
import z from "zod";

const updateProjectCodeSchema = z.object({
    projectId: z
        .string({
            required_error: "Please provide project ID.",
            invalid_type_error: "Project ID must be a string.",
        })
        .refine((id) => Types.ObjectId.isValid(id), {
            message: "Please provide valid project ID.",
        }),
    code: z
        .object(
            {
                html: z
                    .string({
                        invalid_type_error:
                            "Please provide valid HTML code as a string.",
                    })
                    .optional(),
                css: z
                    .string({
                        invalid_type_error:
                            "Please provide valid CSS code as a string.",
                    })
                    .optional(),
                javascript: z
                    .string({
                        invalid_type_error:
                            "Please provide valid JavaScript code as a string.",
                    })
                    .optional(),
            },
            {
                required_error: "Please provide code for the project.",
                invalid_type_error:
                    "Please provide code using an object format that includes html, css and javascript as keys.",
            }
        )
        .refine(
            (code) =>
                !(
                    (!code.html || code.html.trim() === "") &&
                    (!code.css || code.css.trim() === "") &&
                    (!code.javascript || code.javascript.trim() === "")
                ),
            {
                message:
                    "Please include code for either HTML, CSS or JavaScript in your project.",
            }
        ),
});

export { updateProjectCodeSchema };
