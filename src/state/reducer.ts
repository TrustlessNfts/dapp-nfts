import connection from './connection/reducer';
import user from './user/reducer';
import wallets from './wallets/reducer';
import gasFee from './gasFee/reducer';

const reducer = {
  user,
  wallets,
  connection,
  gasFee,
};

export default reducer;
