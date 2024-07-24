import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";
import { changeCurrentLanguage } from "../redux/slices/editorSlice";
import { Button } from "@/components/ui/button";
import { BookCopy, Download, Save, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    useDeleteAProjectMutation,
    useForkAProjectMutation,
    useUpdateProjectCodeMutation,
} from "../redux/api";
import { ApiError } from "../types/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getCompleteHTML } from "../utils/getCompleteHTML";

function ProjectActionsHeader() {
    const [isCopying, setIsCopying] = useState<boolean>(false);

    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const user = useAppSelector((state) => state.auth.user);

    const currentLanguage = useAppSelector(
        (state) => state.editor.currentLanguage
    );

    const project = useAppSelector((state) => state.editor.currentProject);

    const dispatch = useAppDispatch();

    const [saveCode, { isLoading: isSaving }] = useUpdateProjectCodeMutation();

    const [deleteProject, { isLoading: isDeleting }] =
        useDeleteAProjectMutation();

    const [forkProject, { isLoading: isForking }] = useForkAProjectMutation();

    const navigate = useNavigate();

    const saveProjectHandler = async () => {
        if (
            project?.code.html.trim() === "" &&
            project?.code.css.trim() === "" &&
            project?.code.javascript.trim() === ""
        ) {
            toast(
                "Please include code for either HTML, CSS or JavaScript in your project."
            );
            return;
        }
        try {
            const response = await saveCode({
                projectId: project?._id!,
                code: {
                    html: project?.code.html || "",
                    css: project?.code.css || "",
                    javascript: project?.code.javascript || "",
                },
            }).unwrap();
            toast(response.message);
        } catch (error) {
            const errorResponse = error as { status: number; data: ApiError };
            if (errorResponse.data.errors) {
                toast(
                    `${errorResponse.data.message} ${errorResponse.data.errors
                        .map((error) => `${error.field} : ${error.error}`)
                        .join(", ")}`
                );
            } else {
                toast(
                    errorResponse.data?.message ||
                        "We have encountered an issue. Please try again soon."
                );
            }
        }
    };

    const shareProjectHandler = async () => {
        try {
            setIsCopying(true);
            await navigator.clipboard.writeText(
                `${import.meta.env.VITE_CLIENT_URL}/project/${project?._id}`
            );
            toast(
                "The project link has been successfully copied to your clipboard!"
            );
        } catch (error) {
            toast(
                "Oops! Something went wrong while copying the project link. Please try again."
            );
        } finally {
            setIsCopying(false);
        }
    };

    const forkProjectHandler = async () => {
        try {
            const response = await forkProject({
                projectId: project?._id!,
            }).unwrap();
            navigate(`/project/${response.project._id}`, { replace: true });
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

    const downloadProjectHandler = async () => {
        try {
            setIsDownloading(true);
            if (
                project?.code.html.trim() === "" &&
                project?.code.css.trim() === "" &&
                project?.code.javascript.trim() === ""
            ) {
                toast(
                    "Please include code in at least one of the files (HTML, CSS or JavaScript) to download."
                );
                setIsDownloading(false);
                return;
            }
            const zip = new JSZip();
            if (project?.code.html.trim() !== "") {
                zip.file(
                    "index.html",
                    getCompleteHTML(project?.name!, project?.code.html!)
                );
            }
            if (project?.code.css.trim() !== "") {
                zip.file("styles.css", project?.code.css!);
            }
            if (project?.code.javascript.trim() !== "") {
                zip.file("index.js", project?.code.javascript!);
            }
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${project?.name}.zip`);
            toast("Your project has been downloaded successfully!");
        } catch (error) {
            toast(
                "Oops! Something went wrong while downloading the project. Please try again."
            );
        } finally {
            setIsDownloading(false);
        }
    };

    const deleteProjectHandler = async () => {
        try {
            const response = await deleteProject(project?._id!).unwrap();
            toast(response.message);
            navigate("/projects", { replace: true });
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
        <div className="border-t border-editorLightMode dark:border-editorDarkMode py-2">
            <div className="w-19/20 max-w-7xl mx-auto flex flex-col xsm:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-x-2">
                    {user?._id === project?.user ? (
                        <>
                            <Button
                                size="icon"
                                variant="success"
                                disabled={isSaving}
                                onClick={saveProjectHandler}
                            >
                                <Save />
                            </Button>
                            <Button
                                size="icon"
                                disabled={isCopying}
                                onClick={shareProjectHandler}
                            >
                                <Share2 />
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="icon"
                            disabled={isForking}
                            onClick={forkProjectHandler}
                        >
                            <BookCopy />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        variant="secondary"
                        disabled={isDownloading}
                        onClick={downloadProjectHandler}
                    >
                        <Download />
                    </Button>
                    {user?._id === project?.user && (
                        <Button
                            size="icon"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={deleteProjectHandler}
                        >
                            <Trash2 />
                        </Button>
                    )}
                </div>
                <div>
                    <Select
                        value={currentLanguage}
                        onValueChange={(value: "html" | "css" | "javascript") =>
                            dispatch(changeCurrentLanguage(value))
                        }
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                            <SelectItem value="javascript">
                                JavaScript
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

export default ProjectActionsHeader;
