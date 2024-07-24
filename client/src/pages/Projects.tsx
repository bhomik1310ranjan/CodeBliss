import {
    useCreateProjectMutation,
    useGetAllMyProjectsQuery,
    useDeleteAProjectMutation,
} from "../redux/api";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "../types/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { formatDateAndTime } from "../utils/formatDateAndTime";
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

function Projects() {
    const { data, isLoading } = useGetAllMyProjectsQuery();

    const createProjectSchema = z.object({
        name: z
            .string()
            .min(3, {
                message: "Project name must be atleast 3 characters long.",
            })
            .max(32, { message: "Project name cannot exceed 32 characters." }),
    });

    const createProjectForm = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
        },
    });

    const [createProject, { isLoading: isCreating }] =
        useCreateProjectMutation();

    const navigate = useNavigate();

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleCreateProject = async (
        data: z.infer<typeof createProjectSchema>
    ) => {
        try {
            const response = await createProject({ name: data.name }).unwrap();
            setIsDialogOpen(false);
            navigate(`/project/${response.project._id}`);
            toast(response.message);
        } catch (error) {
            const errorResponse = error as { status: number; data: ApiError };
            if (errorResponse.data?.errors) {
                toast(errorResponse.data.message);
                errorResponse.data.errors.map(({ field, error }) =>
                    createProjectForm.setError(
                        field as keyof typeof createProjectSchema.shape,
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

    const [deleteProject, { isLoading: isDeleting }] =
        useDeleteAProjectMutation();

    const deleteProjectHandler = async (projectId: string) => {
        try {
            const response = await deleteProject(projectId).unwrap();
            toast(response.message);
        } catch (error) {
            const errorResponse = error as { status: number; data: ApiError };
            if (errorResponse.data.errors) {
                toast(errorResponse.data.errors[0].error);
            } else {
                toast(errorResponse.data.message);
            }
        }
    };

    return (
        <div className="w-11/12 max-w-7xl mx-auto py-6">
            {isLoading ? (
                <div className="h-[calc(100vh-116px)] flex justify-center items-center">
                    <div className="relative inline-flex -translate-y-[34px]">
                        <div className="w-12 aspect-square bg-primary rounded-full"></div>
                        <div className="w-12 aspect-square bg-primary rounded-full absolute top-0 left-0 animate-ping"></div>
                        <div className="w-12 aspect-square bg-primary rounded-full absolute top-0 left-0 animate-pulse"></div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 bwMdLg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-y-2 border border-accent rounded-lg shadow hover:bg-accent transition-colors duration-300 p-4">
                        <div className="flex justify-between items-center gap-x-2">
                            <div className="text-xl">Create new project</div>
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={(open) =>
                                    !isCreating && setIsDialogOpen(open)
                                }
                            >
                                <DialogTrigger asChild>
                                    <Button variant="success" size="icon">
                                        <Plus />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-11/12 max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Create project
                                        </DialogTitle>
                                        <DialogDescription>
                                            Enter a name for your project
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...createProjectForm}>
                                        <form
                                            onSubmit={createProjectForm.handleSubmit(
                                                handleCreateProject
                                            )}
                                            className="flex flex-col gap-y-1.5 xsm:gap-y-2.5"
                                        >
                                            <FormField
                                                control={
                                                    createProjectForm.control
                                                }
                                                name="name"
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
                                            <Button
                                                type="submit"
                                                disabled={isCreating}
                                            >
                                                {isCreating ? (
                                                    <div className="flex items-center gap-x-2">
                                                        <LoaderCircle
                                                            size={20}
                                                            className="animate-spin"
                                                        />
                                                        <div>
                                                            Creating project
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>Create project</>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div>
                            Easily create a new project and start coding right
                            away.
                        </div>
                    </div>
                    {data?.projects.map((project) => (
                        <div
                            key={project._id}
                            className="flex flex-col gap-y-2 border border-accent rounded-lg shadow hover:bg-accent transition-colors duration-300 p-3"
                        >
                            <div className="flex items-center justify-between gap-x-2.5">
                                <div className="text-base sm:text-lg">
                                    {project.name}
                                </div>
                                <div className="flex items-center gap-x-2">
                                    <Link to={`/project/${project._id}`}>
                                        <Button
                                            size="icon"
                                            className="w-7 h-7 sm:w-8 sm:h-8"
                                        >
                                            <Pencil size={20} />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        disabled={isDeleting}
                                        onClick={() =>
                                            deleteProjectHandler(project._id)
                                        }
                                        className="w-7 h-7 sm:w-8 sm:h-8"
                                    >
                                        <Trash2 size={20} />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-sm">
                                <div>
                                    Created at :{" "}
                                    {formatDateAndTime(project.createdAt)}
                                </div>
                                <div>
                                    Last updated at :{" "}
                                    {formatDateAndTime(project.updatedAt)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Projects;
