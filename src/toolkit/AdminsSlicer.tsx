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
  name: "Admins",
  initialState,
  reducers: {
    setAdmins(state, { payload }: PayloadAction<UserTypes[]>) {
      state.data = payload;
      state.isPending = false;
      state.error = "";
    },
    setAdminsPending(state) {
      state.isPending = true;
    },
    setAdminsError(state, { payload }: PayloadAction<string>) {
      state.error = payload;
      state.isPending = false;
    },
  },
});

export const { setAdmins, setAdminsError, setAdminsPending } =
  ProductsSlicer.actions;
export default ProductsSlicer.reducer;
