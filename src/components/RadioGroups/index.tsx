import React from 'react';
import { StyledRadioGroups } from './RadioGroups.styled';

type Props = {
  label?: string;
  options: { key: string; value: string }[];
  className?: string;
  name: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const RadioGroups = ({
  label,
  options,
  className,
  name,
  defaultValue,
  onChange,
}: Props) => {
  return (
    <StyledRadioGroups className={className}>
      {label && <label>{label}</label>}
      <div className={'groups'}>
        {options?.map((option, index) => {
          return (
            <div key={`${option.key}-${index}`} className={'inputGroups'}>
              <input
                type="radio"
                id={option.key}
                value={option.key}
                name={name}
                defaultChecked={option.key === defaultValue}
                onChange={onChange}
              />
              <label htmlFor={option.key}>{option.value}</label>
            </div>
          );
        })}
      </div>
    </StyledRadioGroups>
  );
};

export default React.memo(RadioGroups);
