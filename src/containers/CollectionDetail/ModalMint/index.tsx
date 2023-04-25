import Button from '@/components/Button';
import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL, TC_WEB_URL } from '@/configs';
import { MINT_TOOL_MAX_FILE_SIZE } from '@/constants/config';
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
  WrapInput,
} from '@/containers/Collections/ModalCreate/ModalCreate.styled';
import { AssetsContext } from '@/contexts/assets-context';
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
import { showError } from '@/utils/toast';
import { formatBTCPrice } from '@trustless-computer/dapp-core';
import { Buffer } from 'buffer';
import { Transaction } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import * as TC_SDK from 'trustless-computer-sdk';

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

  const [estBTCFee, setEstBTCFee] = useState('0');
  const [file, setFile] = useState<File | null>(null);
  // const [listFiles, setListFiles] = useState<Array<Array<Buffer>> | null>();
  const { feeRate } = useContext(AssetsContext);

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
        showError({
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
        console.log('batch number', listOfChunks.length);
      }
      currentBatchSize += chunksSizeInKb;
      currentChunks.push(chunks);
      console.log('currentBatchSize', currentBatchSize);
    }

    console.log('batch number', listOfChunks.length);
    listOfChunks.push([...currentChunks]);
    console.log('listOfChunks', listOfChunks);

    return listOfChunks;
  };

  const handleEstFee = async (): Promise<void> => {
    if (!file) {
      setEstBTCFee('0');
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
          .reduce((prev, cur) => prev + cur, 0) || 28000;

      const estimatedFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: tcTxSizeBytes,
        feeRatePerByte: feeRate.fastestFee,
      });

      setEstBTCFee(estimatedFee.totalFee.toString());
    } else {
      const obj = {
        image: await fileToBase64(file),
      };
      const chunks = Buffer.from(JSON.stringify(obj));
      const estimatedFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: Buffer.byteLength(chunks),
        feeRatePerByte: feeRate.fastestFee,
      });
      setEstBTCFee(estimatedFee.totalFee.toString());
    }
  };

  const handleMintSingle = async (file: File): Promise<void> => {
    if (!collection?.contract) {
      showError({
        message: 'Contract address not found.',
      });
      return;
    }

    try {
      setIsMinting(true);
      const obj = {
        image: await fileToBase64(file),
      };
      console.log('json', JSON.stringify(obj));
      const chunks = Buffer.from(JSON.stringify(obj));
      await mintSingle({
        contractAddress: collection.contract,
        chunks: chunks,
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      onUpdateSuccess();
    } catch (err: unknown) {
      console.log(err);
      if ((err as Error).message === 'pending') {
        showError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${TC_WEB_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else {
        showError({
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
    if (!collection?.contract) {
      showError({
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
      if ((err as Error).message === 'pending') {
        showError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${TC_WEB_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else {
        showError({
          message:
            (err as Error).message ||
            'Something went wrong. Please try again later.',
        });
      }
      console.log(err);
    } finally {
      setIsMinting(false);
    }
  };

  const handleMintFile = async (file: File): Promise<void> => {
    const fileName = file.name;
    const fileExt = getFileExtensionByFileName(fileName);
    if (!isERC721SupportedExt(fileExt)) {
      showError({
        message: 'Unsupported file extension.',
      });
      return;
    }

    if (fileExt === ZIP_EXTENSION) {
      await handleMintBatch(file);
    } else {
      const fileSizeInKb = file.size / 1000;
      if (fileSizeInKb > BLOCK_CHAIN_FILE_LIMIT * 1000) {
        showError({
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
  }, [file]);

  return (
    <StyledModalUpload show={show} onHide={handleClose} centered>
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
          <WrapInput className="mb-20">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={collection.name}
              className="input"
              placeholder={`Enter name`}
              disabled={true}
            />
          </WrapInput>
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
                  Zip file
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
          <div className="divider"></div>
          <div className="est-fee">
            <div className="est-fee-item">
              <Text size="regular" color="text333">
                Estimated fee (BTC)
              </Text>
              <Text size="medium" color="bg1" fontWeight="medium">
                ~ {formatBTCPrice(estBTCFee)} BTC
              </Text>
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
