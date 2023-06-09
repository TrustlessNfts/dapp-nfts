import React from 'react';

const ImageWrapper: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props: React.ImgHTMLAttributes<HTMLImageElement>): React.ReactElement => {

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

  return (
    <img {...props} onLoad={handleOnImgLoaded} />
  );
}

export default ImageWrapper;
