import { TC_BRIDGE_URL, TC_DAPP_STORE, TC_GAS_STATION, TC_WEB_WALLET_URL } from "@/configs";

export const MENU_HEADER = [
  {
    id: 'menu-1',
    name: 'Trustless',
    route: TC_DAPP_STORE,
  },
  {
    id: 'menu-2',
    name: 'Get TC',
    route: TC_GAS_STATION,
  },
  {
    id: 'menu-3',
    name: 'Wallet',
    route: TC_WEB_WALLET_URL,
  },
  {
    id: 'menu-4',
    name: 'Wrap BTC',
    route: `${TC_BRIDGE_URL}/btc`,
  },
  {
    id: 'menu-5',
    name: 'Wrap ETH',
    route: `${TC_BRIDGE_URL}/eth`,
  },
];

export const MENU_MOBILE = [...MENU_HEADER];
