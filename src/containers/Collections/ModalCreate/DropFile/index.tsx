import cs from 'classnames';
import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { StyledDropFile } from './DropFile.styled';
import { MINT_TOOL_MAX_FILE_SIZE } from '@/constants/config';
import IconSVG from '@/components/IconSVG';
import { CDN_URL } from '@/configs';
import { prettyPrintBytes } from '@trustless-computer/dapp-core';
import { Spinner } from 'react-bootstrap';

export interface IProps {
  className: string;
  acceptedFileType?: Array<string>;
  // fileOrFiles?: File[] | null;
  uploadFile: File | null;
  labelText: string;
  maxSize: number;
  onChange: (files: File | null) => void;
  isProcessing: boolean;
}

const DropFile: React.FC<IProps> = ({
  acceptedFileType,
  // fileOrFiles,
  uploadFile,
  className,
  labelText,
  maxSize,
  onChange,
  isProcessing,
}: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChangeFile = (file: File): void => {
    setFile(file);
    setError('');
    onChange(file);
  };

  const onSizeError = (): void => {
    setError(
      `File size error, maximum file size is ${MINT_TOOL_MAX_FILE_SIZE * 1000}kb.`,
    );
  };

  const onTypeError = (): void => {
    setError('Invalid file extension.');
  };

  useEffect(() => {
    setFile(uploadFile);
  }, [uploadFile]);

  return (
    <StyledDropFile
      className={cs('dropFile', className, {
        ['dropFile__drag']: false,
        ['dropFile__error']: !!error,
      })}
    >
      <FileUploader
        handleChange={onChangeFile}
        name={'zipFileUploader'}
        maxSize={maxSize}
        minSize={0}
        types={acceptedFileType}
        onTypeError={onTypeError}
        onSizeError={onSizeError}
        classes={'dropZone'}
      >
        <div>
          <IconSVG
            maxWidth={'100'}
            maxHeight={'100'}
            className={'dropZoneThumbnail'}
            src={`${CDN_URL}/images/docs.svg`}
          ></IconSVG>
          {file ? (
            <p className={'dropZoneDescription'}>
              {`${file.name} (${prettyPrintBytes(file.size)})`}
            </p>
          ) : (
            <p className={'dropZoneDescription'}>{labelText}</p>
          )}
          {error && (
            <p className={cs('dropZoneDescription', 'errorText')}>{error}</p>
          )}
          {isProcessing && (
            <div className={'loadingWrapper'}>
              <div className={'loadingIndicatorWrapper'}>
                <Spinner animation="border" variant="primary" />
              </div>
              <p className={'loadingText'}>Unzipping file...</p>
            </div>
          )}
        </div>
      </FileUploader>
    </StyledDropFile>
  );
};

export default DropFile;
