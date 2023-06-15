import { TC_EXPLORER } from '@/constants/url';
import { IOwnerAnalytic } from '@/interfaces/api/marketplace';
import { shortenAddress } from '@/utils';
import { useRouter } from 'next/router';
import { jsNumberForAddress } from 'react-jazzicon';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
import { StyledOwnersList } from './OwnersList.styled';

type Props = {
  list: IOwnerAnalytic[];
};

const OwnersList = ({ list }: Props) => {
  const router = useRouter();

  return (
    <StyledOwnersList className="data-table">
      <thead>
        <tr>
          <th>Owners</th>
          <th>Items</th>
        </tr>
      </thead>
      <tbody>
        {list.map((owner) => {
          return (
            <tr
              key={owner.address}
              onClick={() => router.push(`${TC_EXPLORER}/address/${owner.address}`)}
            >
              <td className="owner-info">
                <div className="owner-info-wrapper">
                  <div className="owner-avatar">
                    {owner.avatar ? (
                      <img src={owner.avatar} alt="avatar" />
                    ) : (
                      <Jazzicon
                        diameter={32}
                        seed={jsNumberForAddress(owner.address)}
                      />
                    )}
                  </div>
                  {!!owner.name ? owner.name : shortenAddress(owner.address)}
                </div>
              </td>
              <td className="owner-items">{owner.count}</td>
            </tr>
          );
        })}
      </tbody>
    </StyledOwnersList>
  );
};

export default OwnersList;
