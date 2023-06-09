import Button from '@/components/Button';
import EstimatedFee from '@/components/EstimatedFee';
import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL } from '@/configs';
import { MINT_TOOL_MAX_FILE_SIZE } from '@/constants/config';
import {
  BLOCK_CHAIN_FILE_LIMIT,
  STATIC_IMAGE_EXTENSIONS,
  ZIP_EXTENSION,
} from '@/constants/file';
import web3Provider from '@/connection/custom-web3-provider';

import DropFile from '@/containers/Collections/ModalCreate/DropFile';
import {
  Checkboxes,
  StyledModalUpload,
  Title,
} from '@/containers/Collections/ModalCreate/ModalCreate.styled';
import { AssetsContext } from '@/contexts/assets-context';
import useMintBatchChunks, {
  IMintBatchChunksParams,
} from '@/hooks/contract-operations/nft/useMintBatchChunks';
import useMintChunks, {
  IMintChunksParams,
} from '@/hooks/contract-operations/nft/useMintChunks';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { ICollection } from '@/interfaces/api/collection';
import logger from '@/services/logger';
import {
  fileToBase64,
  getFileExtensionByFileName,
  isERC721SupportedExt,
  unzipFile,
} from '@/utils';
import { showToastError } from '@/utils/toast';
import { Buffer } from 'buffer';
import { Transaction } from 'ethers';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';

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

const ModalMint = (props: Props) => {
  const { show = false, handleClose, collection, onUpdateSuccess } = props;
  // const [isProcessing, _] = useState(false);
  const [uploadType, setUploadType] = useState(UploadType.Single);
  const [isMinting, setIsMinting] = useState(false);
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const { feeRate } = useContext(AssetsContext);

  const { estimateGas: estimateChunksGas } = useMintChunks();
  // const { estimateGas: estimateBatchChunksGas } = useMintChunks();

  const { run: mintSingle } = useContractOperation<
    IMintChunksParams,
    Transaction | null
  >({
    operation: useMintChunks,
  });
  const { run: mintBatch } = useContractOperation<
    IMintBatchChunksParams,
    Transaction | null
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
          message: `File size error, maximum file size is ${
            BLOCK_CHAIN_FILE_LIMIT * 1000
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

  const calculateEstBtcFee = useCallback(
    (fileSize: number) => {
      const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: fileSize,
        feeRatePerByte: feeRate.hourFee,
      });

      setEstBTCFee(estimatedEconomyFee.totalFee.toString());
    },
    [feeRate, setEstBTCFee],
  );

  const calculateEstTcFee = useCallback(
    async (fileSize: Buffer) => {
      if (!estimateChunksGas) return;

      setEstTCFee(null);
      let payload: IMintChunksParams | IMintBatchChunksParams;
      try {
        // if (!fileSize) {
        //   payload = {
        //     name: preSubmitName,
        //     listOfChunks: [],
        //   };
        // } else {
        //   payload = {
        //     name: preSubmitName,
        //     listOfChunks: listFiles,
        //   };
        // }

        payload = {
          chunks: fileSize,
          contractAddress: collection.contract,
        };

        const gasLimit = await estimateChunksGas(payload);
        const gasPrice = await web3Provider.getGasPrice();
        const gasLimitBN = new BigNumber(gasLimit);
        const gasPriceBN = new BigNumber(gasPrice);
        const tcGas = gasLimitBN.times(gasPriceBN);
        logger.debug('TC Gas', tcGas.toString());
        setEstTCFee(tcGas.toString());
      } catch (err: unknown) {
        logger.error(err);
      }
    },
    [setEstTCFee, estimateChunksGas, collection.contract],
  );

  const handleEstFee = useCallback(async (): Promise<void> => {
    if (!file) {
      setEstBTCFee('0');
      setEstTCFee('0');
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

      calculateEstBtcFee(tcTxSizeBytes);
      calculateEstTcFee(tcTxSizeBytes);
    } else {
      const obj = {
        image: await fileToBase64(file),
      };
      const chunks = Buffer.from(JSON.stringify(obj));

      calculateEstBtcFee(Buffer.byteLength(chunks));
      calculateEstTcFee(chunks);
    }
  }, [calculateEstBtcFee, file]);

  const handleMintSingle = async (file: File): Promise<void> => {
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
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      onUpdateSuccess();
    } catch (err: unknown) {
      logger.error(err);
      showToastError({
        message: (err as Error).message,
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleMintBatch = async (file: File): Promise<void> => {
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
        });
      }
      toast.success('Transaction has been created. Please wait for few minutes.');
      onUpdateSuccess();
    } catch (err: unknown) {
      logger.error(err);
      showToastError({
        message: (err as Error).message,
      });
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
          message: `File size error, maximum file size is ${
            BLOCK_CHAIN_FILE_LIMIT * 1000
          }kb.`,
        });
        return;
      }

      await handleMintSingle(file);
    }
  };

  useEffect(() => {
    handleEstFee();
  }, [file, handleEstFee]);

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
          <EstimatedFee estimateBTCGas={estBTCFee} estimateTCGas={estTCFee} />

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
