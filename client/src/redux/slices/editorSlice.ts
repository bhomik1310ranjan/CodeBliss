import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../types/project";

export interface EditorState {
    currentLanguage: "html" | "css" | "javascript";
    currentProject: Project | null;
}

const initialState: EditorState = {
    currentLanguage: "html",
    currentProject: null,
};

export const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        changeCurrentLanguage: (
            state,
            action: PayloadAction<EditorState["currentLanguage"]>
        ) => {
            state.currentLanguage = action.payload;
        },
        changeCurrentProject: (
            state,
            action: PayloadAction<Project | null>
        ) => {
            state.currentProject = action.payload;
        },
        updateCurrentProjectName: (
            state,
            action: PayloadAction<Project["name"]>
        ) => {
            if (state.currentProject) {
                state.currentProject.name = action.payload;
            }
        },
        updateCurrentProjectCode: (
            state,
            action: PayloadAction<Project["code"]>
        ) => {
            if (state.currentProject) {
                state.currentProject.code = action.payload;
            }
        },
    },
});

export const {
    changeCurrentLanguage,
    changeCurrentProject,
    updateCurrentProjectName,
    updateCurrentProjectCode,
} = editorSlice.actions;

export default editorSlice.reducer;
