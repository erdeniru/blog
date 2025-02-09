import PropTypes from 'prop-types';
import { Icon, Input } from '../../../../components';
import styled from 'styled-components';

const SearchContainer = ({ className, searchPhrase, onChange }) => {
    return (
        <div className={className}>
            <Input
                value={searchPhrase}
                placeholder="Поиск по заголовкам статей..."
                onChange={onChange}
            />
            <Icon id="fa-search" size="21px" inactive={true} />
        </div>
    );
};

export const Search = styled(SearchContainer)`
    display: flex;
    margin: 40px auto 0;
    width: 340px;
    height: 40px;

    position: relative;

    & > input {
        padding: 10px 32px 10px 10px;
    }

    & > div {
        position: absolute;
        top: 3px;
        right: 9px;
        font-size: 21px;
    }
`;

Search.propTypes = {
    searchPhrase: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
