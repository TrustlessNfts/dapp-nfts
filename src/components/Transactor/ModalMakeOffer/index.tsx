import EstimatedFee from '@/components/EstimatedFee';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';
import { MAX_HEX_VALUE } from '@/constants/common';
import { TOKEN_OPTIONS, WETH_ADDRESS } from '@/constants/marketplace';
import useApproveTokenAmount, {
  IApproveTokenAmountParams,
} from '@/hooks/contract-operations/erc20/useApproveTokenAmount';
import useGetAllowanceAmount, {
  IGetAllowanceAmountParams,
} from '@/hooks/contract-operations/erc20/useGetAllowanceAmount';
import useTokenBalance, {
  IGetTokenBalanceParams,
} from '@/hooks/contract-operations/erc20/useTokenBalance';
import useMakeTokenOffer, {
  IMakeTokenOfferParams,
} from '@/hooks/contract-operations/marketplace/useMakeTokenOffer';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IInscription } from '@/interfaces/api/inscription';
import logger from '@/services/logger';
import { exponentialToDecimal, mappingERC20ToSymbol } from '@/utils/format';
import {
  checkCacheApprovalTokenPermission,
  setCacheApprovalTokenPermission,
} from '@/utils/marketplace-storage';
import { showToastError, showToastSuccess } from '@/utils/toast';
import BigNumber from 'bignumber.js';
import { Transaction } from 'ethers';
import { Formik } from 'formik';
import isNaN from 'lodash/isNaN';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Web3 from 'web3';
import TransactorBaseModal from '../TransactorBaseModal';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription | null;
}

interface IFormValues {
  price: string;
  erc20Token: string;
}

const ModalMakeOffer: React.FC<IProps> = ({
  show,
  handleClose,
  inscription,
}: IProps) => {
  const [processing, setProcessing] = useState(false);
  const { run: getTokenBalance } = useContractOperation<
    IGetTokenBalanceParams,
    string
  >({
    operation: useTokenBalance,
    inscribeable: false,
  });
  const { run: getAllowanceAmount } = useContractOperation<
    IGetAllowanceAmountParams,
    number
  >({
    operation: useGetAllowanceAmount,
    inscribeable: false,
  });
  const { run: approveTokenAmount } = useContractOperation<
    IApproveTokenAmountParams,
    Transaction | null
  >({
    operation: useApproveTokenAmount,
    inscribeable: false,
  });
  const { run: makeOffer } = useContractOperation<
    IMakeTokenOfferParams,
    Transaction | null
  >({
    operation: useMakeTokenOffer,
    inscribeable: true,
  });

  const validateForm = (values: IFormValues) => {
    const errors: Record<string, string> = {};

    if (!values.price) {
      errors.price = 'Price is required.';
    } else if (isNaN(values.price) || Number(values.price) <= 0) {
      errors.price = 'Invalid number. Must be a numeric and greater than 0.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValues) => {
    if (processing || !inscription) return;
    logger.debug(values);

    try {
      setProcessing(true);
      const { price, erc20Token } = values;

      // Check ERC20 balance
      const tokenBalance = await getTokenBalance({
        contractAddress: erc20Token,
      });

      const balanceBN = new BigNumber(tokenBalance);
      const priceBN = new BigNumber(
        Web3.utils.toWei(exponentialToDecimal(Number(price))),
      );

      logger.debug(
        'Price',
        `${priceBN.dividedBy(1e18).toString()} ${mappingERC20ToSymbol(
          erc20Token,
        )}`,
      );

      logger.debug(
        'Account balance',
        `${balanceBN.dividedBy(1e18).toString()} ${mappingERC20ToSymbol(
          erc20Token,
        )}`,
      );

      if (balanceBN.isLessThan(priceBN)) {
        logger.error('Insufficient balance');
        showToastError({
          message: `Insufficient ${mappingERC20ToSymbol(
            erc20Token,
          )} balance. Require ${price} ${mappingERC20ToSymbol(
            erc20Token,
          )}. You have ${balanceBN
            .dividedBy(1e18)
            .toString()} ${mappingERC20ToSymbol(erc20Token)}.`,
        });
        return;
      }

      const allowanceAmount = await getAllowanceAmount({
        contractAddress: erc20Token,
        operatorAddress: TC_MARKETPLACE_CONTRACT,
      });
      const allowanceAmountBN = new BigNumber(allowanceAmount);
      const hasApprovalCache = checkCacheApprovalTokenPermission(
        `${TC_MARKETPLACE_CONTRACT}_${erc20Token}`,
      );

      logger.debug('allowanceAmountBN', allowanceAmountBN.toString());
      logger.debug('hasApprovalCache', hasApprovalCache);

      if (!allowanceAmountBN.isGreaterThan(price) && !hasApprovalCache) {
        logger.debug(TC_MARKETPLACE_CONTRACT);
        logger.debug(inscription.collectionAddress);

        await approveTokenAmount({
          tokenAddress: erc20Token,
          consumerAddress: TC_MARKETPLACE_CONTRACT,
          amount: MAX_HEX_VALUE,
        });

        setCacheApprovalTokenPermission(`${TC_MARKETPLACE_CONTRACT}_${erc20Token}`);
      }

      logger.debug({
        collectionAddress: inscription.collectionAddress,
        erc20Token: erc20Token,
        price: price,
        durationTime: 0,
        tokenID: inscription.tokenId,
      });

      await makeOffer({
        collectionAddress: inscription.collectionAddress,
        erc20Token: erc20Token,
        price: exponentialToDecimal(Number(price)),
        durationTime: 0,
        tokenID: inscription.tokenId,
      });

      showToastSuccess({
        message:
          'Please go to your wallet to authorize the request for the Bitcoin transaction.',
      });
      handleClose();
    } catch (err: unknown) {
      logger.error(err);
      showToastError({
        message: (err as Error).message,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <TransactorBaseModal title={'Make offer'} show={show} handleClose={handleClose}>
      <Formik
        key="makeOffer"
        initialValues={{
          erc20Token: WETH_ADDRESS,
          price: '0',
        }}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-item">
              <label className="label" htmlFor="erc20Token">
                Choose token
              </label>
              <Form.Select
                className={'form-control'}
                value={values.erc20Token}
                onChange={handleChange}
                name="erc20Token"
                id="erc20Token"
              >
                {TOKEN_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="form-item">
              <label className="label" htmlFor="price">
                Price
              </label>
              <Form.Control
                className={'form-control'}
                value={values.price}
                onChange={handleChange}
                type="number"
                name="price"
                id="price"
                placeholder="Set a price"
              />
              {touched.price && errors.price && (
                <p className="form-control-error">{errors.price}</p>
              )}
            </div>
            <div className="form-item">
              <EstimatedFee />
            </div>
            <div className="action-wrapper">
              <SubmitButton disabled={processing} type="submit">
                {processing ? 'Processing...' : 'Confirm'}
              </SubmitButton>
            </div>
          </form>
        )}
      </Formik>
    </TransactorBaseModal>
  );
};

export default ModalMakeOffer;
