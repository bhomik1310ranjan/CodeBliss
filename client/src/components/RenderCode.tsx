import { useAppSelector } from "../redux/app/hooks";

function RenderCode() {
    const code = useAppSelector((state) => state.editor.currentProject?.code);

    const combinedCode = `<html><head><style>${code?.css}</style></head><body>${code?.html}<script>${code?.javascript}</script></body></html>`;

    const iframeCode = `data:text/html;charset=utf-8,${encodeURIComponent(
        combinedCode
    )}`;

    return (
        <div className="h-full bg-white">
            <iframe className="w-full h-full" src={iframeCode} />
        </div>
    );
}

export default RenderCode;
