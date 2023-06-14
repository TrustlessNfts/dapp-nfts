import { PLACEHOLDER_IMAGE } from '@/constants/common';
import { getImageURLContent } from '@/lib';
import React, { useMemo } from 'react';

const ImageWrapper: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props: React.ImgHTMLAttributes<HTMLImageElement>): React.ReactElement => {

  const imageSrc = useMemo(() => {
    if (!props.src) {
      return
    }
    if (props.src.startsWith('/dapp')) return getImageURLContent(props.src);
    return props.src;
  }, [props.src]);

  const handleOnImgLoaded = (
    evt: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    if (props.onLoad) {
      props.onLoad(evt);
    }

    const img = evt.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    if (naturalWidth < 100) {
      img.style.imageRendering = 'pixelated';
    }
  };

  const handleOnImgError = (
    evt: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    if (props.onError) {
      props.onError(evt);
    }

    const img = evt.target as HTMLImageElement;
    img.src = PLACEHOLDER_IMAGE;
  };

  return (
    <img
      alt='image'
      {...props}
      src={imageSrc}
      onLoad={handleOnImgLoaded}
      onError={handleOnImgError}
    />
  );
}

export default ImageWrapper;
