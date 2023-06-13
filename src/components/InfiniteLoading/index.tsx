import React, { useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import s from './styles.module.scss';

interface InfiniteLoadingProps {
  fetchMoreData: () => void;
  isLoading: boolean;
  hasMoreData: boolean;
}

const InfiniteLoading: React.FC<InfiniteLoadingProps> = ({ fetchMoreData, isLoading, hasMoreData }) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleObserver: IntersectionObserverCallback = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading && hasMoreData) {
      fetchMoreData();
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, hasMoreData, fetchMoreData]);

  return (
    <div>
      {isLoading && (
        <div className={s.loadingWrapper} ref={loaderRef}>
          <Spinner variant="light" />
        </div>
      )}

      {!isLoading && hasMoreData && (
        <div ref={loaderRef}>
        </div>
      )}
    </div>
  );
};

export default InfiniteLoading;
