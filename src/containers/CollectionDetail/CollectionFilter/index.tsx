import RadioGroups from '@/components/RadioGroups';
import Text from '@/components/Text';
import { StyledSelect } from '@/components/Dropdown/Select.styled';
import { CollectionContext } from '@/contexts/collection-context';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useContext, useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import Select, { components } from 'react-select';
import { StyledCollectionFilter } from './CollectionFilter.styled';
import FilterMinMax from './FilterMinMax';

type IProps = {
  floorPrice: number;
};

const CollectionFilter = ({ floorPrice }: IProps) => {
  const { attributes, query, setQuery } = useContext(CollectionContext);
  const { mobileScreen } = useWindowSize();
  const { rarity, attributes: qsAttrs, price } = query;

  const [currentTraitOpen, setCurrentTraitOpen] = useState<string | null>(null);
  const [filterRarity, setFilterRarity] = useState({
    from: rarity ? rarity.split(',')[0] : '',
    to: rarity ? rarity.split(',')[1] : '',
  });
  const [filterPrice, setFilterPrice] = useState({
    from: price ? price.split(',')[0] : '',
    to: price ? price.split(',')[1] : '',
  });
  const [filterTraits, setFilterTraits] = useState<string>('');

  const buyNowOptions = [
    { key: 'true', value: 'Only buy now' },
    { key: 'false', value: 'Show all' },
  ];

  useEffect(() => {
    setQuery(prev => ({
      ...prev,
      attributes: filterTraits,
    }));
  }, [filterTraits, setQuery]);

  useEffect(() => {
    setQuery(prev => ({
      ...prev,
      rarity: `${filterRarity.from ? filterRarity.from : 0},${
        filterRarity.to || 100
      }`,
    }));
  }, [filterRarity, setQuery]);

  useEffect(() => {
    setQuery(prev => ({
      ...prev,
      price: `${filterPrice.from ? filterPrice.from : 0},${
        filterPrice.to ? filterPrice.to : -1
      }`,
    }));
  }, [filterPrice, setQuery]);

  useEffect(() => {
    setFilterTraits(qsAttrs || '');
  }, [qsAttrs]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Option = (props: any) => {
    const attrName = props.label.split(':')[0];
    const rarity = props.label.split(':')[1];

    const { value, selectProps } = props;

    const handleSelectOption = () => {
      setCurrentTraitOpen(selectProps.placeholder);

      const str = `${selectProps.placeholder}:${value}`;
      setFilterTraits((prev) => {
        if (!prev) {
          return str;
        }
        if (prev.includes(str)) {
          const list = prev.split(',');
          const newList = list.filter((item) => item !== str);

          return newList.length > 1 ? newList.join(',') : newList[0] ?? '';
        } else {
          return `${prev},${str}`;
        }
      });
    };

    const defaultChecked = filterTraits
      ?.split(',')
      ?.includes(`${selectProps.placeholder}:${value}`);

    return (
      <div>
        <components.Option {...props}>
          <Stack
            direction="horizontal"
            className="justify-between cursor-pointer w-full"
            onClick={handleSelectOption}
          >
            <label htmlFor={`trait-${attrName}`}>{attrName}</label>
            <Stack direction="horizontal" gap={3} className={'checkbox'}>
              <span>{rarity}</span>
              <input
                type="checkbox"
                id={`trait-${attrName}`}
                checked={defaultChecked}
              />
            </Stack>
          </Stack>
        </components.Option>
      </div>
    );
  };

  return (
    <StyledCollectionFilter>
      <RadioGroups
        options={buyNowOptions}
        name="buyNow"
        defaultValue={buyNowOptions[1].key}
        className={'radio_buynow'}
        onChange={(e) => {
          setQuery({
            ...query,
            buyable: e.target.value === 'true' ? true : undefined,
          });
        }}
      />
      {attributes && attributes?.length > 0 && (
        <div className={'rarity'}>
          <FilterMinMax
            label="Rarity"
            placeholderMin="1"
            placeholderMax="100"
            filter={filterRarity}
            setFilter={setFilterRarity}
          />
        </div>
      )}
      {floorPrice && floorPrice > 0 && (
        <div className={'rarity'}>
          <FilterMinMax
            filterPrice
            label="Price"
            placeholderMin="0.001"
            placeholderMax="0.001"
            filter={filterPrice}
            setFilter={setFilterPrice}
          />
        </div>
      )}
      {attributes && attributes?.length > 0 && (
        <>
          <div className={'filter_traits'}>
            <Stack direction="horizontal" className="justify-between">
              <Text size="regular" fontWeight="medium">
                Attributes
              </Text>
            </Stack>
            <div className={'filter_traits_dropdown'}>
              {attributes?.length > 0 &&
                attributes.map((attr, index, arr) => {
                  const _traitStats = [...attr.traitValuesStat];

                  const options: Array<{ value: string; label: string }> =
                    _traitStats
                      .sort((a, b) => a.rarity - b.rarity)
                      .map((item) => {
                        return {
                          value: item.value,
                          label: `${item.value}:${item.rarity.toFixed(1)}%`,
                        };
                      });

                  let selectedOptions = '';
                  const prefix = `${attr.traitName}:`;
                  if (filterTraits && filterTraits.length > 0) {
                    const substrings = filterTraits.split(',') || '';
                    const matches = substrings
                      .filter((substring) => substring.trim().startsWith(prefix))
                      ?.map((substring) => substring.slice(prefix.length));
                    selectedOptions = matches.join(', ');
                  }
                  return (
                    <>
                      <StyledSelect>
                        <Select
                          defaultMenuIsOpen={currentTraitOpen === attr.traitName}
                          // defaultMenuIsOpen={true}
                          id={`attributes-${index}`}
                          key={`attributes-${index}`}
                          isMulti
                          name={`attributes-${index}`}
                          options={options}
                          className={'attribute-select'}
                          components={{
                            Option,
                          }}
                          onMenuOpen={() => setCurrentTraitOpen(attr.traitName)}
                          onBlur={() => setCurrentTraitOpen(null)}
                          classNamePrefix="select"
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          controlShouldRenderValue={false}
                          isClearable={false}
                          placeholder={attr.traitName ? attr.traitName : 'Unknown'}
                          autoFocus={currentTraitOpen === attr.traitName}
                          menuPosition="fixed"
                          menuPlacement={
                            arr.length >= 5 &&
                            (index === arr.length - 1 || index === arr.length - 2)
                              ? 'top'
                              : 'auto'
                          }
                        />
                      </StyledSelect>
                      {mobileScreen && selectedOptions && (
                        <span>
                          {prefix} {selectedOptions}
                        </span>
                      )}
                    </>
                  );
                })}
            </div>
          </div>
        </>
      )}
      {/* {marketplaceData && marketplaceData.listed > 0 && (
        <div className={styles.price}>
          <FilterMinMax
            filterPrice
            label="Price"
            placeholderMin="0.001"
            placeholderMax="0.001"
            filter={filterPrice}
            setFilter={setFilterPrice}
          />
        </div>
      )} */}
    </StyledCollectionFilter>
  );
};

export default CollectionFilter;
