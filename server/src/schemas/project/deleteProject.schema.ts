import { Types } from "mongoose";
import z from "zod";

const deleteProjectSchema = z.object({
    projectId: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Please provide valid project ID.",
    }),
});

export { deleteProjectSchema };
