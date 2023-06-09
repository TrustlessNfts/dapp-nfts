import Button from '@/components/Button';
import EstimatedFee from '@/components/EstimatedFee';
import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL, TRANSFER_TX_SIZE } from '@/configs';
import web3Provider from '@/connection/custom-web3-provider';
import { MINT_TOOL_MAX_FILE_SIZE } from '@/constants/config';
import {
  BLOCK_CHAIN_FILE_LIMIT,
  STATIC_IMAGE_EXTENSIONS,
  ZIP_EXTENSION,
} from '@/constants/file';
import { AssetsContext } from '@/contexts/assets-context';
import useCreateNFTCollection, {
  ICreateNFTCollectionParams,
} from '@/hooks/contract-operations/nft/useCreateNFTCollection';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { DeployContractResponse } from '@/interfaces/contract-operation';
import logger from '@/services/logger';
import {
  fileToBase64,
  getFileExtensionByFileName,
  isERC721SupportedExt,
  unzipFile,
} from '@/utils';
import { showToastError, showToastSuccess } from '@/utils/toast';
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';
import { Formik } from 'formik';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import * as TC_SDK from 'trustless-computer-sdk';
import DropFile from './DropFile';
import {
  Checkboxes,
  StyledModalUpload,
  Title,
  WrapInput,
} from './ModalCreate.styled';

interface IFormValue {
  name: string;
}

type Props = {
  show: boolean;
  handleClose: () => void;
};

enum UploadType {
  Single = 0,
  Zip = 1,
}

const ModalCreate = (props: Props) => {
  const { show = false, handleClose } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadType, setUploadType] = useState(UploadType.Single);
  const { run } = useContractOperation<
    ICreateNFTCollectionParams,
    DeployContractResponse | null
  >({
    operation: useCreateNFTCollection,
  });
  const { estimateGas } = useCreateNFTCollection();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showUploadField, setShowUploadField] = useState(false);
  const [listFiles, setListFiles] = useState<Array<Array<Buffer>> | null>();
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);
  const [preSubmitName, setPreSubmitName] = useState('');
  const { feeRate } = useContext(AssetsContext);

  const onChangeFile = (file: File | null): void => {
    setFile(file);
  };

  const handleSingleFile = async (file: File): Promise<Array<Array<Buffer>>> => {
    const obj = {
      image: await fileToBase64(file),
    };
    const chunks = Buffer.from(JSON.stringify(obj));
    const chunkItem = [chunks];
    return [chunkItem];
  };

  const handleZipFile = async (file: File): Promise<Array<Array<Buffer>>> => {
    const files: Record<string, Blob> = await unzipFile(file);
    const listOfChunks: Array<Array<Buffer>> = [];
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
        throw Error(
          `File size error, maximum file size is ${
            BLOCK_CHAIN_FILE_LIMIT * 1000
          }kb.`,
        );
      }
      if (currentBatchSize + chunksSizeInKb >= BLOCK_CHAIN_FILE_LIMIT * 1000) {
        return listOfChunks;
      }

      listOfChunks.push([chunks]);
      currentBatchSize += chunksSizeInKb;
    }

    return listOfChunks;
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.name) {
      errors.name = 'Name is required.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    const { name } = values;

    try {
      let listOfChunks: Array<Array<Buffer>> = [];
      setIsProcessing(true);
      if (file) {
        const fileName = file.name;
        const fileExt = getFileExtensionByFileName(fileName);
        if (!isERC721SupportedExt(fileExt)) {
          showToastError({
            message: 'Unsupported file extension.',
          });
          return;
        }

        if (fileExt === ZIP_EXTENSION) {
          listOfChunks = await handleZipFile(file);
        } else {
          listOfChunks = await handleSingleFile(file);
        }
      }

      await run({
        name,
        listOfChunks,
      });

      showToastSuccess({
        message:
          'Please go to your wallet to authorize the request for the Bitcoin transaction.',
      });
      handleClose();
    } catch (err) {
      showToastError({
        message: (err as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShowUploadField = () => {
    if (!showUploadField) {
      setShowUploadField(true);
    } else {
      setShowUploadField(false);
      setFile(null);
      setListFiles([]);
    }
  };

  const totalFileSize = useMemo(() => {
    if (!listFiles) return 0;
    const tcTxSizeBytes = listFiles
      .map((chunk) => chunk.reduce((prev, cur) => prev + Buffer.byteLength(cur), 0))
      .reduce((prev, cur) => prev + cur, 0);
    return tcTxSizeBytes;
  }, [listFiles]);

  const calculateEstBtcFee = useCallback(async () => {
    if (!file) return;
    try {
      setEstBTCFee(null);

      const tcTxSizeByte = TRANSFER_TX_SIZE;

      // if (file.size < BLOCK_CHAIN_FILE_LIMIT) {
      //   const fileBuffer = await readFileAsBuffer(file);
      //   const { compressedSize } = await compressFileAndGetSize({
      //     fileBase64: fileBuffer.toString('base64'),
      //   });
      //   tcTxSizeByte = TRANSFER_TX_SIZE;
      // }

      const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: tcTxSizeByte,
        feeRatePerByte: feeRate.hourFee,
      });

      setEstBTCFee(estimatedEconomyFee.totalFee.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [file, setEstBTCFee, feeRate.hourFee]);

  const calculateEstTcFee = useCallback(async () => {
    if (!listFiles) return;

    setEstTCFee(null);
    const payload: ICreateNFTCollectionParams = {
      name: '',
      listOfChunks: listFiles,
    };
    logger.debug('Payload', payload);
    try {
      //   if (file.size < BLOCK_CHAIN_FILE_LIMIT) {
      //     const fileBuffer = await readFileAsBuffer(file);
      //     payload = {
      //       address: account,
      //       chunks: [fileBuffer],
      //     };
      //   } else {
      //     payload = {
      //       address: account,
      //       chunks: [],
      //     };
      //   }
      const gasLimit = await estimateGas(payload);
      const gasPrice = await web3Provider.getGasPrice();
      const gasLimitBN = new BigNumber(gasLimit);
      const gasPriceBN = new BigNumber(gasPrice);
      const tcGas = gasLimitBN.times(gasPriceBN);
      logger.debug('TC Gas', tcGas.toString());
      setEstTCFee(tcGas.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [file, setEstTCFee, estimateGas]);

  useEffect(() => {
    if (file) {
      const fileExt = getFileExtensionByFileName(file.name);

      if (fileExt === ZIP_EXTENSION) {
        setIsProcessingFile(true);
        handleZipFile(file)
          .then((listOfChunks) => {
            setListFiles(listOfChunks);
          })
          .catch((err) => {
            showToastError({
              message: (err as Error).message,
            });
          })
          .finally(() => {
            setIsProcessingFile(false);
          });
      } else {
        handleSingleFile(file)
          .then((listOfChunks) => {
            setListFiles(listOfChunks);
          })
          .catch((err) => {
            showToastError({
              message: (err as Error).message,
            });
          })
          .finally(() => {
            setIsProcessingFile(false);
          });
      }
    }
  }, [file]);

  useEffect(() => {
    calculateEstBtcFee();
  }, [calculateEstBtcFee]);

  useEffect(() => {
    calculateEstTcFee();
  }, [calculateEstTcFee]);

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
        <Title className="font-medium">Create BRC-721</Title>
        <Formik
          key="create"
          initialValues={{
            name: '',
            symbol: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <WrapInput className="mb-20">
                <label htmlFor="name">
                  Collection Name <span className="text-red">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className="input"
                  placeholder={`Enter collection name`}
                />
                {errors.name && touched.name && (
                  <p className="error">{errors.name}</p>
                )}
              </WrapInput>

              <div className="upload">
                <Text
                  size="regular"
                  fontWeight="medium"
                  className="mb-4 upload-title"
                  onClick={handleShowUploadField}
                >
                  <IconSVG src={`${CDN_URL}/icons/ic-upload.svg`} maxWidth="20" />
                  Upload NFT {showUploadField ? 'later' : 'now'}
                </Text>
                <Text
                  color={'black'}
                  style={{ fontStyle: 'italic' }}
                  className="mb-8"
                >
                  (You can mint additional NFTs later after your collection is
                  created.)
                </Text>
              </div>
              {showUploadField && (
                <div className="upload-wrapper">
                  <div className="upload-options">
                    <Checkboxes>
                      <label
                        className="label"
                        onClick={() => {
                          setUploadType(UploadType.Single);
                          setFile(null);
                          setListFiles(null);
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
                          setListFiles(null);
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
                      uploadType === UploadType.Single
                        ? STATIC_IMAGE_EXTENSIONS
                        : ['zip']
                    }
                    uploadFile={file}
                    maxSize={
                      uploadType === UploadType.Single
                        ? MINT_TOOL_MAX_FILE_SIZE
                        : 9999999
                    }
                    onChange={onChangeFile}
                    isProcessing={isProcessingFile}
                  />
                  <ul className="extra-info">
                    {uploadType === UploadType.Zip && (
                      <li className="font-bold">
                        Please note that one zip file can only include one file
                        extension.
                      </li>
                    )}
                    <li>
                      Supported file extensions are{' '}
                      {STATIC_IMAGE_EXTENSIONS.join(', ')}.
                    </li>
                    <li>Maximum file size is 350KB.</li>
                  </ul>
                </div>
              )}
              <EstimatedFee
                estimateBTCGas={estBTCFee}
                estimateTCGas={estTCFee}
                // classNames,
              />
              <div className="confirm">
                <Button
                  disabled={isProcessing}
                  type="submit"
                  className="confirm-btn"
                >
                  <Text size="medium" fontWeight="medium" className="confirm-text">
                    {isProcessing ? 'Processing...' : 'Create'}
                  </Text>
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledModalUpload>
  );
};

export default ModalCreate;
