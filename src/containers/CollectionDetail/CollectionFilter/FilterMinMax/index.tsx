import IconSVG from '@/components/IconSVG';
import { CDN_URL } from '@/configs';
import useOnClickOutside from '@/hooks/useOnClickOutSide';
import { debounce } from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { StyledFilterMinMax } from './FilterMinMax.styled';

type Props = {
  label?: string;
  filterPrice?: boolean;
  placeholderMin?: string;
  placeholderMax?: string;
  filter: {
    from: string;
    to: string;
  };
  setFilter: (filter: { from: string; to: string }) => void;
};

const FilterMinMax = (props: Props) => {
  const {
    label,
    filterPrice = false,
    placeholderMin,
    placeholderMax,
    filter,
    setFilter,
  } = props;

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setShowDropdown(false));

  const handleMinInputChange = (value: string) => {
    if (value) {
      const _value = value;
      setFilter({
        ...filter,
        from: `${_value}`,
      });
    } else {
      setFilter({
        ...filter,
        from: '',
      });
    }
  };

  const handleMaxInputChange = (value: string) => {
    if (value) {
      const _value = value;

      setFilter({
        ...filter,
        to: `${_value}`,
      });
    } else {
      setFilter({
        ...filter,
        to: '',
      });
    }
  };

  const hasValue = useMemo(() => {
    return filter?.from || filter?.to;
  }, [filter?.from, filter?.to]);

  const fromValue = filter?.from;

  const toValue = filter?.to;

  return (
    <StyledFilterMinMax className={`${'wrapper'}`} ref={dropdownRef}>
      <div className={'dropdown_box'} onClick={() => setShowDropdown(!showDropdown)}>
        <p>
          {label}
          {hasValue && ':'}
          {filter?.from &&
            ` Min (${fromValue}${filterPrice ? ' BTC' : '%'}) ${filter?.to && '-'}`}
          {filter?.to && ` Max (${toValue}${filterPrice ? ' BTC' : '%'})`}
        </p>
        <IconSVG
          maxWidth={'20'}
          src={`${CDN_URL}/icons/ic-chevron-down.svg`}
          className={'icon'}
        />
      </div>
      <div className={`${'dropdown'} ${showDropdown ? 'show' : ''}`}>
        <div className={'input_wrapper'}>
          <p className={'label'}>Min</p>
          <div className={'divider'}></div>
          <div className={'input'}>
            <input
              type="number"
              placeholder={placeholderMin}
              onChange={debounce((e) => {
                handleMinInputChange(e.target.value);
              }, 1000)}
            />
            {filterPrice && <p color="black-60">BTC</p>}
          </div>
        </div>
        <div className={'input_wrapper'}>
          <p className={'label'}>Max</p>
          <div className={'divider'}></div>
          <div className={'input'}>
            <input
              type="number"
              placeholder={placeholderMax}
              onChange={debounce((e) => {
                handleMaxInputChange(e.target.value);
              }, 1000)}
            />
            {filterPrice && <p color="black-60">BTC</p>}
          </div>
        </div>
      </div>
    </StyledFilterMinMax>
  );
};

export default FilterMinMax;
