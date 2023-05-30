import Button from '@/components/Button';
import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL, TC_WEB_WALLET_URL } from '@/configs';
import { MINT_TOOL_MAX_FILE_SIZE } from '@/constants/config';
import { ERROR_CODE } from '@/constants/error';
import {
  BLOCK_CHAIN_FILE_LIMIT,
  STATIC_IMAGE_EXTENSIONS,
  ZIP_EXTENSION,
} from '@/constants/file';
import DropFile from '@/containers/Collections/ModalCreate/DropFile';
import {
  Checkboxes,
  StyledModalUpload,
  Title,
} from '@/containers/Collections/ModalCreate/ModalCreate.styled';
import { MempoolContext } from '@/contexts/mempool-context';
import { DappsTabs } from '@/enums/tabs';
import useMintBatchChunks, {
  IMintBatchChunksParams,
} from '@/hooks/contract-operations/nft/useMintBatchChunks';
import useMintChunks, {
  IMintChunksParams,
} from '@/hooks/contract-operations/nft/useMintChunks';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { ICollection } from '@/interfaces/api/collection';
import {
  fileToBase64,
  getFileExtensionByFileName,
  isERC721SupportedExt,
  unzipFile,
} from '@/utils';
import { showToastError } from '@/utils/toast';
import { formatBTCPrice } from '@trustless-computer/dapp-core';
import { Buffer } from 'buffer';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import * as TC_SDK from 'trustless-computer-sdk';
import { IRequestSignResp } from 'tc-connect';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import logger from '@/services/logger';

type Props = {
  show: boolean;
  handleClose: () => void;
  collection: ICollection;
  onUpdateSuccess: () => void;
};

enum UploadType {
  Single = 0,
  Zip = 1,
}

enum optionFees {
  economy = 'Economy',
  faster = 'Faster',
  fastest = 'Fastest',
}

const ModalMint = (props: Props) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const { show = false, handleClose, collection, onUpdateSuccess } = props;
  const [uploadType, setUploadType] = useState(UploadType.Single);
  const [isMinting, setIsMinting] = useState(false);
  const [estBTCFee, setEstBTCFee] = useState({
    economy: '0',
    faster: '0',
    fastest: '0',
  });
  const [file, setFile] = useState<File | null>(null);
  // const [listFiles, setListFiles] = useState<Array<Array<Buffer>> | null>();
  const { feeRate } = useContext(MempoolContext);

  const { run: mintSingle } = useContractOperation<
    IMintChunksParams,
    IRequestSignResp | null
  >({
    operation: useMintChunks,
  });
  const { run: mintBatch } = useContractOperation<
    IMintBatchChunksParams,
    IRequestSignResp | null
  >({
    operation: useMintBatchChunks,
  });

  const onChangeFile = (file: File | null): void => {
    setFile(file);
  };

  const getBatchFileList = async (file: File): Promise<Array<Array<Buffer>>> => {
    const files: Record<string, Blob> = await unzipFile(file);
    const listOfChunks: Array<Array<Buffer>> = [];
    let currentChunks: Array<Buffer> = [];
    let currentBatchSize = 0;

    // Create batch of chunks
    for (const fileName in files) {
      const blob = files[fileName];
      const obj = {
        image: await fileToBase64(blob),
      };
      const chunks = Buffer.from(JSON.stringify(obj));
      const chunksSizeInKb = Buffer.byteLength(chunks) / 1000;
      if (chunksSizeInKb > BLOCK_CHAIN_FILE_LIMIT * 1000) {
        showToastError({
          message: `File size error, maximum file size is ${BLOCK_CHAIN_FILE_LIMIT * 1000
            }kb.`,
        });
        return [];
      }
      if (currentBatchSize + chunksSizeInKb >= BLOCK_CHAIN_FILE_LIMIT * 1000) {
        // Split chunks and reset counter
        listOfChunks.push([...currentChunks]);
        currentChunks = [];
        currentBatchSize = 0;
      }
      currentBatchSize += chunksSizeInKb;
      currentChunks.push(chunks);
    }

    listOfChunks.push([...currentChunks]);

    return listOfChunks;
  };

  const calculateEstFee = (fileSize: number) => {
    const estimatedFastestFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: fileSize,
      feeRatePerByte: feeRate.fastestFee,
    });
    const estimatedFasterFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: fileSize,
      feeRatePerByte: feeRate.halfHourFee,
    });
    const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: fileSize,
      feeRatePerByte: feeRate.hourFee,
    });

    setEstBTCFee({
      fastest: estimatedFastestFee.totalFee.toString(),
      faster: estimatedFasterFee.totalFee.toString(),
      economy: estimatedEconomyFee.totalFee.toString(),
    });
  };

  const handleEstFee = async (): Promise<void> => {
    if (!file) {
      setEstBTCFee({
        economy: '0',
        faster: '0',
        fastest: '0',
      });
      return;
    }
    const fileExt = getFileExtensionByFileName(file.name);
    if (fileExt === ZIP_EXTENSION) {
      const listOfChunks = await getBatchFileList(file);
      const tcTxSizeBytes =
        listOfChunks
          ?.map((chunk) =>
            chunk.reduce((prev, cur) => prev + Buffer.byteLength(cur), 0),
          )
          .reduce((prev, cur) => prev + cur, 0) || 0;

      calculateEstFee(tcTxSizeBytes);
    } else {
      const obj = {
        image: await fileToBase64(file),
      };
      const chunks = Buffer.from(JSON.stringify(obj));

      calculateEstFee(Buffer.byteLength(chunks));
    }
  };

  const handleMintSingle = async (file: File): Promise<void> => {
    if (!user.tcAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    if (!collection?.contract) {
      showToastError({
        message: 'Contract address not found.',
      });
      return;
    }

    try {
      setIsMinting(true);
      const obj = {
        image: await fileToBase64(file),
      };
      const chunks = Buffer.from(JSON.stringify(obj));
      await mintSingle({
        contractAddress: collection.contract,
        chunks: chunks,
        owner: user.tcAddress,
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      onUpdateSuccess();
    } catch (err: unknown) {
      logger.error(err);
      if ((err as Error).message === ERROR_CODE.PENDING) {
        showToastError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${TC_WEB_WALLET_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else if ((err as Error).message === ERROR_CODE.INSUFFICIENT_BALANCE) {
        showToastError({
          message: `Your balance is insufficient. Please top up BTC to pay network fee.`,
          url: `${TC_WEB_WALLET_URL}`,
          linkText: 'Go to Wallet',
        });
      } else {
        showToastError({
          message:
            (err as Error).message ||
            'Something went wrong. Please try again later.',
        });
      }
    } finally {
      setIsMinting(false);
    }
  };

  const handleMintBatch = async (file: File): Promise<void> => {
    if (!user.tcAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    if (!collection?.contract) {
      showToastError({
        message: 'Contract address not found.',
      });
      return;
    }
    try {
      setIsMinting(true);
      const listOfChunks: Array<Array<Buffer>> = await getBatchFileList(file);

      for (let i = 0; i < listOfChunks.length; i++) {
        const batch = listOfChunks[i];
        await mintBatch({
          contractAddress: collection.contract,
          listOfChunks: batch,
          owner: user.tcAddress
        });
      }
      toast.success('Transaction has been created. Please wait for few minutes.');
      onUpdateSuccess();
    } catch (err: unknown) {
      showToastError({
        message: (err as Error).message
      });
      logger.error(err);
    } finally {
      setIsMinting(false);
    }
  };

  const handleMintFile = async (file: File): Promise<void> => {
    const fileName = file.name;
    const fileExt = getFileExtensionByFileName(fileName);
    if (!isERC721SupportedExt(fileExt)) {
      showToastError({
        message: 'Unsupported file extension.',
      });
      return;
    }

    if (fileExt === ZIP_EXTENSION) {
      await handleMintBatch(file);
    } else {
      const fileSizeInKb = file.size / 1000;
      if (fileSizeInKb > BLOCK_CHAIN_FILE_LIMIT * 1000) {
        showToastError({
          message: `File size error, maximum file size is ${BLOCK_CHAIN_FILE_LIMIT * 1000
            }kb.`,
        });
        return;
      }

      await handleMintSingle(file);
    }
  };

  const renderEstFee = ({
    title,
    estFee,
    feeRate,
  }: {
    title: optionFees;
    estFee: string;
    feeRate: number;
  }) => {
    return (
      <div
        className={`est-fee-item`}
      >
        <div>
          <Text fontWeight="medium" color="text2" size="regular">
            {title}
          </Text>
          <Text color="border2" className="mb-10">
            {feeRate} sats/vByte
          </Text>
          <p className="ext-price">
            {formatBTCPrice(estFee)} <span>BTC</span>
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    handleEstFee();
  }, [file]);

  return (
    <StyledModalUpload show={show} onHide={handleClose} centered size="lg">
      <Modal.Header>
        <IconSVG
          className="cursor-pointer"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close-1.svg`}
          maxWidth={'22px'}
        />
      </Modal.Header>
      <Modal.Body>
        <Title className="font-medium">Mint BRC-721</Title>
        {/* <Formik key="mint" onSubmit={handleMintFile}>
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => ( */}
        <form>
          <div className="upload">
            <Text size="regular" fontWeight="medium" className="mb-4" color="bg1">
              Upload NFT
            </Text>
            <div className="upload-options">
              <Checkboxes>
                <label
                  className="label"
                  onClick={() => {
                    setUploadType(UploadType.Single);
                    setFile(null);
                    // setListFiles(null);
                  }}
                >
                  Single image
                  <input
                    type="checkbox"
                    checked={uploadType === UploadType.Single}
                    name="fileType"
                  />
                  <span className="checkmark"></span>
                </label>
                <label
                  className="label"
                  onClick={() => {
                    setUploadType(UploadType.Zip);
                    setFile(null);
                    // setListFiles(null);
                  }}
                >
                  Multi-image (Zip file)
                  <input
                    type="checkbox"
                    checked={uploadType === UploadType.Zip}
                    name="fileType"
                  />
                  <span className="checkmark"></span>
                </label>
              </Checkboxes>
            </div>

            <DropFile
              labelText={
                uploadType === UploadType.Single
                  ? 'Upload your image file here.'
                  : 'Upload your Zip file here.'
              }
              className={'dropZoneContainer'}
              acceptedFileType={
                uploadType === UploadType.Single ? STATIC_IMAGE_EXTENSIONS : ['zip']
              }
              uploadFile={file}
              maxSize={
                uploadType === UploadType.Single ? MINT_TOOL_MAX_FILE_SIZE : 9999999
              }
              onChange={onChangeFile}
              isProcessing={false}
            />
          </div>
          <ul className="extra-info">
            {uploadType === UploadType.Zip && (
              <li className="font-bold">
                Please note that one zip file can only include one file extension.
              </li>
            )}
            <li>
              Supported file extensions are {STATIC_IMAGE_EXTENSIONS.join(', ')}.
            </li>
            <li>
              Maximum file size
              {uploadType === UploadType.Zip && ' for each file in zip'} is 350KB.
            </li>
          </ul>
          <div className="est-fee">
            <Text size="regular" fontWeight="medium" color="bg1" className="mb-8">
              Estimated network fee
            </Text>
            <div className="est-fee-options">
              {renderEstFee({
                title: optionFees.economy,
                estFee: estBTCFee.economy,
                feeRate: feeRate.hourFee,
              })}
              {renderEstFee({
                title: optionFees.faster,
                estFee: estBTCFee.faster,
                feeRate: feeRate.halfHourFee,
              })}
              {renderEstFee({
                title: optionFees.fastest,
                estFee: estBTCFee.fastest,
                feeRate: feeRate.fastestFee,
              })}
            </div>
          </div>
          <div className="confirm">
            <Button
              type="submit"
              className="confirm-btn"
              disabled={isMinting || !file}
              onClick={() => {
                if (file) handleMintFile(file);
              }}
            >
              <Text size="medium" fontWeight="medium" className="confirm-text">
                {isMinting ? 'Processing...' : 'Mint'}
              </Text>
            </Button>
          </div>
        </form>
        {/* )} */}
        {/* </Formik> */}
      </Modal.Body>
    </StyledModalUpload>
  );
};

export default ModalMint;
