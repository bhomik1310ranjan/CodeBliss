import { LoaderCircle, Pencil } from "lucide-react";
import { useAppSelector } from "../redux/app/hooks";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateProjectNameMutation } from "@/redux/api";
import { toast } from "sonner";
import { ApiError } from "../types/api";

function ProjectNameHeader() {
    const project = useAppSelector((state) => state.editor.currentProject);

    const updateProjectNameSchema = z.object({
        newName: z
            .string()
            .min(3, {
                message: "Project name must be atleast 3 characters long.",
            })
            .max(32, { message: "Project name cannot exceed 32 characters." }),
    });

    const updateProjectNameForm = useForm<
        z.infer<typeof updateProjectNameSchema>
    >({
        resolver: zodResolver(updateProjectNameSchema),
        defaultValues: {
            newName: project?.name || "",
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const [updateName, { isLoading }] = useUpdateProjectNameMutation();

    const handleUpdateProjectName = async (
        data: z.infer<typeof updateProjectNameSchema>
    ) => {
        try {
            const response = await updateName({
                projectId: project?._id!,
                newName: data.newName,
            }).unwrap();
            setIsDialogOpen(false);
            toast(response.message);
        } catch (error) {
            const errorResponse = error as { status: number; data: ApiError };
            if (errorResponse.data?.errors) {
                toast(errorResponse.data.message);
                errorResponse.data.errors.map(({ field, error }) =>
                    updateProjectNameForm.setError(
                        field as keyof typeof updateProjectNameSchema.shape,
                        {
                            type: "custom",
                            message: error,
                        }
                    )
                );
            } else {
                setIsDialogOpen(false);
                toast(
                    errorResponse.data?.message ||
                        "We have encountered an issue. Please try again soon."
                );
            }
        }
    };

    useEffect(() => {
        if (project && isDialogOpen) {
            updateProjectNameForm.setValue("newName", project.name);
        }
    }, [project, isDialogOpen]);

    return (
        <div className="pb-4">
            <div className="w-11/12 max-w-7xl mx-auto flex justify-center items-center gap-x-3">
                <div className="custom-scroll w-3/4 xsm:w-11/12 max-w-64 h-9 border border-primary rounded-md overflow-x-auto px-2 py-[5px]">
                    {project?.name}
                </div>
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => !isLoading && setIsDialogOpen(open)}
                >
                    <DialogTrigger asChild>
                        <Button size="icon">
                            <Pencil size={16} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-11/12 max-w-md">
                        <DialogHeader>
                            <DialogTitle>Update Project Name</DialogTitle>
                            <DialogDescription>
                                Enter a new name for your project
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...updateProjectNameForm}>
                            <form
                                onSubmit={updateProjectNameForm.handleSubmit(
                                    handleUpdateProjectName
                                )}
                                className="flex flex-col gap-y-1.5 xsm:gap-y-2.5"
                            >
                                <FormField
                                    control={updateProjectNameForm.control}
                                    name="newName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter project name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center gap-x-2">
                                            <LoaderCircle
                                                size={20}
                                                className="animate-spin"
                                            />
                                            <div>Updating name</div>
                                        </div>
                                    ) : (
                                        <>Update name</>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default ProjectNameHeader;
