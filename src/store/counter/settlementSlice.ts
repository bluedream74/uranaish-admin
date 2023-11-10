import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosTokenApi } from "../../utils/axios";
import { SettlementType } from "../../pages/Settlement";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SettlementSliceType {
  settlementList: SettlementType[];
  status: "idle" | "loading" | "failed"
}

const initialState: SettlementSliceType = {
  settlementList: [],
  status: "idle"
}

export const getSettlementList = createAsyncThunk(
  'settlement/getList',
  async () => {
    const response = await axiosTokenApi.get('/settlement/api/payment-reports/');
    return response.data;
  }
)

export interface UpdateSettlementType {
  id: number;
  status: number;
  price: number;
}

export const updateSettlementStatus = createAsyncThunk(
  'settlement/changeStatus',
  async (payload: UpdateSettlementType) => {
    const response = await axiosTokenApi.post('/settlement/api/change_status/', payload);
    return response.data;
  }
)

export const settlementSlice = createSlice({
  name: 'settlement',
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<"idle" | "failed" | "loading">) => {
      state.status = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getSettlementList.fulfilled, (state, action) => {
      state.settlementList = action.payload.map((settlement: { payment_at: string; create_at: string; update_at: string; }) => ({
        ...settlement,
        payment_at: new Date(settlement.payment_at),
        create_at: new Date(settlement.create_at),
        update_at: new Date(settlement.update_at),
      }));
      state.status = "idle";
    })
    builder
      .addCase(getSettlementList.rejected, (status) => {
        status.settlementList = [];
        status.status = "failed";
      })
      .addCase(getSettlementList.pending, (state) => {
        state.status = "loading";
      })
    builder
      .addCase(updateSettlementStatus.fulfilled, (state, action) => {
        state.settlementList = state.settlementList.map(settlement => (
          settlement.id === action.payload.id ?
            {
              ...settlement,
              status: action.payload.status,
              price: action.payload.price,
              update_at: new Date(action.payload.update_at)
            } :
            settlement
        ));
        state.status = "loading"
      })
      .addCase(updateSettlementStatus.rejected, (state) => {
        state.status = "failed"
        state.settlementList = [...state.settlementList]
      })
      .addCase(updateSettlementStatus.pending, (state) => {
        state.status = "loading"
      })
  },
});

export const { changeStatus } = settlementSlice.actions

export default settlementSlice.reducer;