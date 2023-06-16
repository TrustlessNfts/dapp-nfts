import { createSlice } from '@reduxjs/toolkit';
import { ConnectionType } from '@/connection';

export interface UserState {
  selectedWallet?: ConnectionType;
  walletAddressBtcTaproot?: string;
  walletAddress?: string;
  avatar?: string;
  name?: string;
}

export const initialState: UserState = {
  selectedWallet: undefined,
  walletAddressBtcTaproot: '',
  walletAddress: '',
  avatar: undefined,
  name: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateWalletInfo(state, { payload: { avatar, name } }) {
      state.avatar = avatar;
      state.name = name;
    },
    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet;
    },
    updateEVMWallet(state, { payload }) {
      state.walletAddress = payload;
    },
    updateTaprootWallet(state, { payload }) {
      state.walletAddressBtcTaproot = payload;
    },
    resetUser(state) {
      state.selectedWallet = undefined;
      state.walletAddress = undefined;
      state.walletAddressBtcTaproot = undefined;
      state.avatar = undefined;
      state.name = undefined;
    },
  },
});

export const {
  updateWalletInfo,
  updateSelectedWallet,
  resetUser,
  updateTaprootWallet,
  updateEVMWallet,
} = userSlice.actions;
export default userSlice.reducer;
