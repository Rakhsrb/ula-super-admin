import { UserTypes } from "@/types/RootTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  data: UserTypes[] | [];
  isPending: boolean;
  error: string;
}

const initialState: UserState = {
  data: [],
  isPending: false,
  error: "",
};

const ProductsSlicer = createSlice({
  name: "Students",
  initialState,
  reducers: {
    setStudents(state, { payload }: PayloadAction<UserTypes[]>) {
      state.data = payload;
      state.isPending = false;
      state.error = "";
    },
    setStudentsPending(state) {
      state.isPending = true;
    },
    setStudentsError(state, { payload }: PayloadAction<string>) {
      state.error = payload;
      state.isPending = false;
    },
  },
});

export const { setStudents, setStudentsError, setStudentsPending } =
  ProductsSlicer.actions;
export default ProductsSlicer.reducer;
