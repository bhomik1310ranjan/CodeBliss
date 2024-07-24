import { useGetAProjectQuery } from "../redux/api";
import CodeEditor from "../components/CodeEditor";
import RenderCode from "../components/RenderCode";
import { useParams } from "react-router-dom";
import { ApiError } from "../types/api";
import { changeCurrentProject } from "../redux/slices/editorSlice";
import { useAppDispatch } from "../redux/app/hooks";
import { useEffect, useState } from "react";
import ProjectNameHeader from "../components/ProjectNameHeader";
import ProjectActionsHeader from "../components/ProjectActionsHeader";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

function Project() {
    const [width, setWidth] = useState<number>(window.innerWidth);

    const { projectId } = useParams();

    const { data, isLoading, error } = useGetAProjectQuery(projectId!);

    const errorResponse = error as { status: number; data: ApiError };

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (data) {
            dispatch(changeCurrentProject(data.project));
        }
        if (error) {
            dispatch(changeCurrentProject(null));
        }
    }, [data, error]);

    useEffect(() => {
        const resizeHandler = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", resizeHandler);

        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    return (
        <div className="w-full h-[calc(100vh-68px)]">
            {isLoading ? (
                <div className="h-full flex justify-center items-center">
                    <div className="relative inline-flex -translate-y-[34px]">
                        <div className="w-12 aspect-square bg-primary rounded-full"></div>
                        <div className="w-12 aspect-square bg-primary rounded-full absolute top-0 left-0 animate-ping"></div>
                        <div className="w-12 aspect-square bg-primary rounded-full absolute top-0 left-0 animate-pulse"></div>
                    </div>
                </div>
            ) : errorResponse ? (
                <div className="w-11/12 max-w-7xl h-full mx-auto flex justify-center items-center text-lg text-center">
                    {errorResponse.data.errors
                        ? `${errorResponse.data.errors[0].error}`
                        : `${errorResponse.data.message}`}
                </div>
            ) : (
                <div className="h-full">
                    <ProjectNameHeader />
                    <ResizablePanelGroup
                        className="!h-[calc(100vh-120px)]"
                        direction={width < 768 ? "vertical" : "horizontal"}
                    >
                        <ResizablePanel
                            className={`${
                                width < 340 ? "min-w-[280px]" : "min-w-[340px]"
                            }`}
                            defaultSize={50}
                        >
                            <ProjectActionsHeader />
                            <CodeEditor width={width} />
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel
                            className={`${
                                width < 340 ? "min-w-[280px]" : "min-w-[340px]"
                            }`}
                            defaultSize={50}
                        >
                            <RenderCode />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            )}
        </div>
    );
}

export default Project;
