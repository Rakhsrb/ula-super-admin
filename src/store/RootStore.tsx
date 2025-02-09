import { configureStore } from "@reduxjs/toolkit";
import UserSlicer from "../toolkit/UserSlicer";
import AdminsSlicerSlicer from "../toolkit/AdminsSlicer";
import StudentsSlicerSlicer from "../toolkit/StudentsSlicer";
import CollectionSlicer from "../toolkit/CollectionSlicer";

export const store = configureStore({
  reducer: {
    user: UserSlicer,
    students: StudentsSlicerSlicer,
    admins: AdminsSlicerSlicer,
    collections: CollectionSlicer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
