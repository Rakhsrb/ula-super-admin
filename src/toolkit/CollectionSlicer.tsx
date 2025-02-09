import { CollectionTypes } from "@/types/RootTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CollectionState {
  data: CollectionTypes[];
  isPending: boolean;
  error: string;
}

const initialState: CollectionState = {
  data: [],
  isPending: false,
  error: "",
};

const CollectionSlicer = createSlice({
  name: "Collections",
  initialState,
  reducers: {
    setCollections(state, { payload }: PayloadAction<CollectionTypes[]>) {
      state.data = payload;
      state.isPending = false;
      state.error = "";
    },
    setCollectionsPending(state) {
      state.isPending = true;
    },
    setCollectionsError(state, { payload }: PayloadAction<string>) {
      state.error = payload;
      state.isPending = false;
    },
  },
});

export const { setCollections, setCollectionsError, setCollectionsPending } =
  CollectionSlicer.actions;
export default CollectionSlicer.reducer;
