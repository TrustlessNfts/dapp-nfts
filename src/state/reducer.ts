import connection from './connection/reducer';
import user from './user/reducer';
import wallets from './wallets/reducer';

const reducer = {
  user,
  wallets,
  connection,
};


export default reducer;