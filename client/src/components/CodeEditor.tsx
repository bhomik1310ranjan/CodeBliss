import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { useTheme } from "./theme-provider";
import { useCallback, useEffect, useState } from "react";
import {
    materialLightInit,
    materialDarkInit,
} from "@uiw/codemirror-theme-material";
import { updateCurrentProjectCode } from "../redux/slices/editorSlice";

type EditorTheme = "light" | "dark";

function CodeEditor({ width }: { width: number }) {
    const currentLanguage = useAppSelector(
        (state) => state.editor.currentLanguage
    );

    const code = useAppSelector((state) => state.editor.currentProject?.code);

    const dispatch = useAppDispatch();

    const editorOnChangeHandler = useCallback(
        (value: string) => {
            dispatch(
                updateCurrentProjectCode({
                    html: code?.html || "",
                    css: code?.css || "",
                    javascript: code?.javascript || "",
                    [currentLanguage]: value,
                })
            );
        },
        [dispatch, code, currentLanguage]
    );

    const { theme } = useTheme();

    const [editorTheme, setEditorTheme] = useState<EditorTheme>(() =>
        theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            : theme
    );

    useEffect(() => {
        setEditorTheme(
            theme === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : theme
        );
    }, [theme]);

    const editorThemeOptions = {
        settings: {
            fontSize: "14px",
        },
    };

    return (
        <CodeMirror
            height={
                width < 340 ? "calc(100vh - 216.67px)" : "calc(100vh - 172px)"
            }
            value={code ? code[currentLanguage] : ""}
            onChange={editorOnChangeHandler}
            extensions={[loadLanguage(currentLanguage)!]}
            theme={
                editorTheme === "light"
                    ? materialLightInit(editorThemeOptions)
                    : materialDarkInit(editorThemeOptions)
            }
        />
    );
}

export default CodeEditor;
