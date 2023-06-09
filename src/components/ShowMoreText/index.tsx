import React, { PropsWithChildren, useState } from 'react';
import cs from 'classnames';
import s from './styles.module.scss';

interface IProps {
  maxLines: number;
  showMoreClassname?: string;
}

const ShowMoreText: React.FC<PropsWithChildren<IProps>> = ({ children, maxLines, showMoreClassname }): React.ReactElement => {
  const [showFullText, setShowFullText] = useState(false);

  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };


  return (
    <>
      <div
        className={cs(s.showMoreText, {
          [`${s.showMoreText__full}`]: showFullText
        })}
        style={{
          WebkitLineClamp: showFullText ? 'initial' : maxLines,
          lineClamp: showFullText ? 'initial' : maxLines,
        }}
      >
        {children}

      </div>
      <button className={cs(s.showMoreBtn, showMoreClassname)} onClick={handleToggleText}>
        {showFullText ? 'Show Less' : 'Show More'}
      </button>
    </>
  )
}

export default ShowMoreText;
