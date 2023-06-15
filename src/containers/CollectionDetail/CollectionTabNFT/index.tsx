import React, { useContext, useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Wrapper } from './CollectionTabNFT.styled';
import TokenList from '../TokenList';
import { ICollection, IOwnerAnalytic } from '@/interfaces/api/marketplace';
import Text from '@/components/Text';
import IconSVG from '@/components/IconSVG';
import { CollectionContext } from '@/contexts/collection-context';
import { CDN_URL } from '@/configs';
import OwnersList from '../OwnersList';
import { useRouter } from 'next/router';
import logger from '@/services/logger';

const MOCK = [
  {
    address: 'bc1pcx0jpsxeum3qw0qxvs0wsflvqlec5nsrlyr9lj4uhzmeuprmuqvsrmzd0h',
    name: '',
    avatar: '',
    count: 7,
  },
  {
    address: 'bc1pyknavmqu7fffshzau7wf9srnm0nm6asjh568qmytrrewghn5tfws8mfx88',
    name: '',
    avatar: '',
    count: 4,
  },
  {
    address: 'bc1prf3ly79unetpxv6a0hju8nskygxp3g4dew9f92uvl9qg4rwwvyeqwu6f4v',
    name: '',
    avatar: '',
    count: 4,
  },
  {
    address: 'bc1pze9hp4hztpn3097637c93p9yfqg3pkncn8n9lqrdprzmz5xgywhqydu0ug',
    name: '',
    avatar: '',
    count: 3,
  },
  {
    address: 'bc1pmu4565ejwapq5wu3jlpw6gzn399lusft7ts4yszcjg52u7gspx4sn05etv',
    name: '',
    avatar: '',
    count: 3,
  },
  {
    address: 'bc1pc20jda3e5yysxaqt6ljk32qhw49jp0gaupclxy4uvj5ad973vt7qcym97w',
    name: '',
    avatar: '',
    count: 3,
  },
  {
    address: 'bc1pnsaqpql99hhnnxq2j75phk8fuu3rg4chyqvdsepmxlw4n3ed09ps6d2rj4',
    name: '',
    avatar: '',
    count: 2,
  },
  {
    address: 'bc1psxmftuxlelyhwl5nnj232l4cqrp40ks9d6frmd0kzpnygh7zzpqsd2c3l3',
    name: '',
    avatar: '',
    count: 2,
  },
  {
    address: 'bc1p2u7zvhnw4ng28cu62h77gfr3fjmq3nr2j7chmwh8j9kxn9s2rf8syv5pty',
    name: '',
    avatar: '',
    count: 2,
  },
  {
    address: 'bc1pdv69ctdfwa0vgz3724285m2u5q4dwrq83j9lrnudj7k78cvezgvsjyrjxg',
    name: '',
    avatar: '',
    count: 2,
  },
  {
    address: 'bc1pdcx3x20uqthvme2g2k9gfat3zdn6a66kdrsp9tlkn7vwv9q97lkqdmept4',
    name: '',
    avatar: '',
    count: 2,
  },
  {
    address: 'bc1pxxrc9jel252j35qcc8vy69nzu90f85l7kdvf524kscf7jwel7f3q5gwp69',
    name: '',
    avatar: '',
    count: 2,
  },
  {
    address: 'bc1ptpkve8jzd28saz5xm59805rglldqg9jvrz4vp2pxes55ul2mr4usdmya2j',
    name: '',
    avatar: '',
    count: 2,
  },
  {
    address: 'bc1ptf2l7uql8gh5afxnt2lmlum4ur2se404w3ns0j5ggs22r0fdrv9shmyckk',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1p7fk96dct26pap3m26fvmpk6ryx035w0cy384pnd8ngzljqwam9gs3uqtjs',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pd485larhc9n0lqkdxpap3v4rlyjn0y7tf0gyg5a02qexxpf2yr7saxyvmr',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pd53vuwccl2tvfrvygr2528yhtua592eupdaj8ndv9m0s3fwljehqldc4u8',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pnyl56nnsrqzcxfp3kmymres6apj3l39qjcgeaw2vltlfywpaejxsn4fsp6',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1paz6kjeaufzggmk4v5eyjzcfzk8rtgh750z8txwlrqn5l5tf3gfcsvhfd7t',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1p2e0f3auxtd93qsgz66q2glmef5p73w540frynzhy9zrxan7nuv7s7eu87n',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pgynqr8a3v5npkqk420m09s4l32ecad2clcwexsjzda2a5fkgtq7sspdedt',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pzvunne86l4xsrue9e98njhzw9vhknd0wyczeqlh8ydc6lesqf3cq9mjrur',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1p0r6dwrd5u7skmy9xtcqkcg4gs0l6jrjjwgsf63fr0rk9lyp4jn8stc96qk',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pcahw9xnxy2gkgzdz4gcrgvkgzq54w7029ejpuemgd4205u6qa0gqtvtuuj',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1puqnyxelyecuc5yl7485ahmjkp84emd4hrvg6mdjj9puddugwk2qsngryk2',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pastpygv3tdnj534hl9d8d6uxzknweavhncthp37h2srycfzf7g9ssukvgx',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1patwtkcvu7uja4p8jhdgy5mnmm9hlhkc43vuhdl826fwya7aq22kss4q3v5',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1p4rg0eju8swvpugtn9vflxj49asx9tf7xyenymvqzmvz2705fjlesrxwc74',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1phdhtq88evckayjgvjgq0lxmqkl6eqttfqv7lsw8a06h69t7dewjq8npx40',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pg886vyvun40lrj7ucgalyd99c8m0lyjrk4sym4vrdhkvm2tmtenswztvsq',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pcppn0u9cjrfm86kqu44dljwgfess6ad757cdaa657gs7gz2hmmcqldn30y',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1ppjqwzzkp8p6g2fcazc7v0cea9x023dq8tsvm6mdfuwf93sv5jkeqkwqesx',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1p2hs4kequhvl28vmnksqn6v80a9pkd0lmgg23gjk2sep2cshj2e2slrrkr9',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pu6afx7hchc3ks4j84vn0qa8sgjknj9qre5ddj6rmk8t35kgvtrqssqlgee',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1p75jcw6q962wkdx705wylu5yquq70uttp3mfnvpfnytkujk3q2r6s7x25w9',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pescxtm6pp8j8r33rmwzh45n9p0duncg7tlurq8qdw4f07dnjs32s5tzmqm',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pcv88tvgue8wvv607q0hu6rfp29e062gjj3mwsr3r7933cfy4x2ys7mmt77',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1prufsk03vpapa7jetrcmw5x9y0zgt58h3g09gdvsukxdxhzty4xws23604p',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pmpmc8u6nfr2jjcv3ea0t4fjc339mk3kle5pnhr5ga4gf8ndaldqsrnwadx',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pq47569r6v42cfchsd6z0qs6kuq70p6kyj33s2a582mnhqlyuelrqurtpay',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pu3nmf5g6jnkp7dunpuaed3tumlnfgl45kzp3a6hvqrv6wsanjhfszhp07j',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pk6y62n6zmpqkdg39fsuxdrnn32tumq5dg3c2lnnsq5la489t0msq7pc86x',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pta3zuw929kcm3g2a3mg5xfdkc8tsyh7um9nev2rp8khsv62qcrsqccg3m0',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1p9udsl8rvnt2rckaq9rjd3mjzwc72rha8ravhhnftmqk6p4fzxefsd5jq95',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pt0cfknykx9y9gxpn9rhdy8q06e0ndu6h6fq0vkk787rvcml6e0rsjmw93m',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pvhw53sk6ryys0xterreauqecwmjh4um29du9e2jsfq9h3yfp7nkqwustvs',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1p7te7h4kfyj7gllkt44ax2v5j8qdal78ynl6zrczhd8dl67nxltfqgkvcmj',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pqwk55xxgjcq3r40wjmq57fslhwfftajenjxzwcwwzupjujt7kq8ssfgux7',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pfg5vxn7d0x653st83m26e5fk70gpzz79hhxs9xjr4utf44flu4yqkwpqfg',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pfpsezuq4zjsdkuucl4ynnr2tk0way0e9aaj8jaeaqjcyughufs7s4w2q8g',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1ptl2qpdee7kue84lf7hg9e6lcav02yz50sdwh66j6wl50ldzsrasqsr8as9',
    name: '',
    avatar: '',
    count: 1,
  },
  {
    address: 'bc1pss8dj9s0rqvaz6dm0xy20e70c436kxsdr7ppfgn2r6v0yluw0cksfn6gr7',
    name: '',
    avatar: '',
    count: 1,
  },
];

interface IProps {
  collection: ICollection | null;
}

const CollectionTabNFT: React.FC<IProps> = ({
  collection,
}: IProps): React.ReactElement => {
  const { query, setQuery, totalNfts, setActiveTokenTab } =
    useContext(CollectionContext);
  const router = useRouter();
  const { contract } = router.query as { contract: string };

  const [ownersList, setOwnersList] = useState<IOwnerAnalytic[]>(MOCK);
  const [totalOwners, setTotalOwners] = useState(MOCK.length);
  const [loading, setLoading] = useState(false);

  const { attributes: filterTraits } = query;

  const handleRemoveFilter = (trait: string) => {
    if (!filterTraits) return;

    const newFilterTraits = filterTraits
      .split(',')
      .filter((item) => item !== trait)
      .join(',');

    setQuery({
      ...query,
      attributes: newFilterTraits,
    });
  };

  const fetchOwnersAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getOwnersAnalytics({
        projectID: contract,
      });
      setOwnersList(res || []);
    } catch (err: unknown) {
      logger.debug('Failed to get owners list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnersAnalytics();
  }, []);

  if (!collection) {
    return <></>;
  }

  return (
    <Wrapper>
      <Tabs
        defaultActiveKey="items"
        id="collection-data"
        className="tabs"
        onSelect={(key) => {
          setActiveTokenTab(key);
        }}
      >
        <Tab mountOnEnter eventKey="items" title={`Items (${totalNfts})`}>
          {filterTraits && filterTraits.length > 0 && (
            <div className={'filterList'}>
              {filterTraits.split(',').map((trait, index) => (
                <div
                  key={`trait-${index}`}
                  className={'filterItem d-flex align-items-center'}
                >
                  <Text>{`${trait.split(':')[0]}: ${trait.split(':')[1]}`}</Text>
                  <IconSVG
                    maxWidth={'12'}
                    src={`${CDN_URL}/icons/ic-close-1.svg`}
                    color="white"
                    type="fill"
                    className={'removeIcon cursor-pointer'}
                    onClick={() => {
                      handleRemoveFilter(trait);
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setQuery({
                    ...query,
                    attributes: '',
                  })
                }
              >
                Clear all
              </button>
            </div>
          )}
          <TokenList collection={collection} />
        </Tab>
        {totalOwners && totalOwners > 0 && (
          <Tab mountOnEnter eventKey="owners" title={`Owners (${totalOwners})`}>
            <OwnersList list={ownersList}></OwnersList>
          </Tab>
        )}
      </Tabs>
    </Wrapper>
  );
};

export default CollectionTabNFT;
