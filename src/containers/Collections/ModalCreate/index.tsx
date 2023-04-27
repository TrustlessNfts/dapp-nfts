import Button from '@/components/Button';
import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL, TC_WEB_URL } from '@/configs';
import { MINT_TOOL_MAX_FILE_SIZE } from '@/constants/config';
import { BLOCK_CHAIN_FILE_LIMIT, ZIP_EXTENSION } from '@/constants/file';
import { DappsTabs } from '@/enums/tabs';
import useCreateNFTCollection, {
  ICreateNFTCollectionParams,
} from '@/hooks/contract-operations/nft/useCreateNFTCollection';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { DeployContractResponse } from '@/interfaces/contract-operation';
import {
  fileToBase64,
  getFileExtensionByFileName,
  isERC721SupportedExt,
  unzipFile,
} from '@/utils';
import { showError } from '@/utils/toast';
import { Buffer } from 'buffer';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import DropFile from './DropFile';
import {
  Checkboxes,
  StyledModalUpload,
  Title,
  WrapInput,
} from './ModalCreate.styled';
import { STATIC_IMAGE_EXTENSIONS } from '@/constants/file';
import * as TC_SDK from 'trustless-computer-sdk';
import { AssetsContext } from '@/contexts/assets-context';
import { formatBTCPrice } from '@trustless-computer/dapp-core';
import ToastConfirm from '@/components/ToastConfirm';
import { walletLinkSignTemplate } from '@/utils/configs';

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

enum optionFees {
  economy = 'Economy',
  faster = 'Faster',
  fastest = 'Fastest',
}

const ModalCreate = (props: Props) => {
  const { show = false, handleClose } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadType, setUploadType] = useState(UploadType.Single);
  const [estBTCFee, setEstBTCFee] = useState({
    economy: '0',
    faster: '0',
    fastest: '0',
  });
  const { feeRate } = useContext(AssetsContext);

  const { run } = useContractOperation<
    ICreateNFTCollectionParams,
    DeployContractResponse | null
  >({
    operation: useCreateNFTCollection,
  });
  const { dAppType, transactionType } = useCreateNFTCollection();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [selectFee, setSelectFee] = useState<number>(0);
  const [activeFee, setActiveFee] = useState(optionFees.fastest);

  const [showUploadField, setShowUploadField] = useState(false);
  const [listFiles, setListFiles] = useState<Array<Array<Buffer>> | null>();

  const onChangeFile = (file: File | null): void => {
    setFile(file);
  };

  // const onSizeError = (): void => {
  //   showError({
  //     message: `File size error, maximum file size is ${
  //       MINT_TOOL_MAX_FILE_SIZE * 1000
  //     }KB.`,
  //   });
  // };

  const handleEstFee = async (
    listOfChunks: Array<Array<Buffer>> | null,
  ): Promise<void> => {
    const tcTxSizeBytes =
      listOfChunks
        ?.map((chunk) =>
          chunk.reduce((prev, cur) => prev + Buffer.byteLength(cur), 0),
        )
        .reduce((prev, cur) => prev + cur, 0) || 0;

    const estimatedFastestFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: tcTxSizeBytes,
      feeRatePerByte: feeRate.fastestFee,
    });
    const estimatedFasterFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: tcTxSizeBytes,
      feeRatePerByte: feeRate.halfHourFee,
    });
    const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: tcTxSizeBytes,
      feeRatePerByte: feeRate.hourFee,
    });

    setEstBTCFee({
      fastest: estimatedFastestFee.totalFee.toString(),
      faster: estimatedFasterFee.totalFee.toString(),
      economy: estimatedEconomyFee.totalFee.toString(),
    });

    // setEstBTCFee(estimatedFee.totalFee.toString());
  };

  const handleSingleFile = async (file: File): Promise<Array<Array<Buffer>>> => {
    const obj = {
      image: await fileToBase64(file),
    };
    console.log('json', JSON.stringify(obj));
    const chunks = Buffer.from(JSON.stringify(obj));
    const chunkItem = [chunks];
    return [chunkItem];
  };

  const handleZipFile = async (file: File): Promise<Array<Array<Buffer>>> => {
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
        throw Error(
          `File size error, maximum file size is ${
            BLOCK_CHAIN_FILE_LIMIT * 1000
          }kb.`,
        );
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
          showError({
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

      const tx = await run({
        name,
        listOfChunks,
        selectFee,
      });

      toast.success(
        () => (
          <ToastConfirm
            id="create-success"
            url={walletLinkSignTemplate({
              transactionType,
              dAppType,
              hash: Object(tx).hash,
              isRedirect: true,
            })}
            message="Please go to your wallet to authorize the request for the Bitcoin transaction."
            linkText="Go to wallet"
          />
        ),
        {
          duration: 50000,
          position: 'top-right',
          style: {
            maxWidth: '900px',
            borderLeft: '4px solid #00AA6C',
          },
        },
      );
      // toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      if ((err as Error).message === 'pending') {
        showError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${TC_WEB_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else {
        showError({
          message: (err as Error).message,
        });
      }
      console.log(err);
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
        className={`est-fee-item ${activeFee === title ? 'active' : ''}`}
        onClick={() => {
          setSelectFee(feeRate);
          setActiveFee(title);
        }}
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
    if (file) {
      const fileExt = getFileExtensionByFileName(file.name);

      if (fileExt === ZIP_EXTENSION) {
        setIsProcessingFile(true);
        handleZipFile(file)
          .then((listOfChunks) => {
            setListFiles(listOfChunks);
          })
          .catch((err) => {
            showError({
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
            showError({
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
    handleEstFee(listFiles || null);
  }, [listFiles]);

  useEffect(() => {
    setSelectFee(feeRate.fastestFee);
  }, [feeRate.fastestFee]);

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
                  // onClick={() => {
                  //   setShowUploadField(!showUploadField);
                  // }}
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
              <div className="est-fee">
                <Text
                  size="regular"
                  fontWeight="medium"
                  color="bg1"
                  className="mb-8"
                >
                  Select the network fee
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
