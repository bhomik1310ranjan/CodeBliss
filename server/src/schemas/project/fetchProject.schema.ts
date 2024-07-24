import { Types } from "mongoose";
import z from "zod";

const fetchProjectSchema = z.object({
    projectId: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Please provide valid project ID",
    }),
});

export { fetchProjectSchema };
