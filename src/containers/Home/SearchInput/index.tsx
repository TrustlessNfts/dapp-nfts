import React from 'react';
import { Wrapper } from './SearchInput.styled';
import { CDN_URL } from '@/configs';

interface IProps {
  onChange: (_v: string) => void;
}

const SearchInput: React.FC<IProps> = ({ onChange }: IProps) => {
  return (
    <Wrapper>
      <div className="input-container">
        <img
          className="search-icon"
          src={`${CDN_URL}/icons/search-01.svg`}
          alt="search icon"
        />
        <input
          placeholder="Collection name"
          onChange={(e) => onChange(e.target.value)}
          type="text"
        />
      </div>
    </Wrapper>
  );
};

export default React.memo(SearchInput);
