import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '../../../../../../components';
import { CLOSE_MODAL, openModal, removeCommentAsync } from '../../../../../../actions';
import { selectUserRole } from '../../../../../../selectors';
import { ROLE } from '../../../../../../constants';
import styled from 'styled-components';

const CommentContainer = ({ className, postId, id, author, content, publishedAt }) => {
    const dispatch = useDispatch();

    const userRole = useSelector(selectUserRole);

    const onCommentRemove = (id) => {
        dispatch(
            openModal({
                text: 'Удалить комментарий?',
                onConfirm: () => {
                    dispatch(removeCommentAsync(postId, id));
                    dispatch(CLOSE_MODAL);
                },
                onCancel: () => dispatch(CLOSE_MODAL),
            }),
        );
    };

    const isAdminOrModerator = [ROLE.ADMIN, ROLE.MODERATOR].includes(userRole);

    return (
        <div className={className}>
            <div className="comment">
                <div className="information-panel">
                    <div className="author">
                        <Icon
                            id="fa-user-circle-o"
                            size="18px"
                            margin="0 10px 0 0"
                            inactive={true}
                        />
                        {author}
                    </div>
                    <div className="published-at">
                        <Icon
                            id="fa-calendar-o"
                            size="18px"
                            margin="0 10px 0 0"
                            inactive={true}
                        />
                        {publishedAt}
                    </div>
                </div>
                <div className="comment-text">{content}</div>
            </div>
            {isAdminOrModerator && (
                <Icon
                    id="fa-trash-o"
                    size="21px"
                    margin="0 0 0 10px"
                    onClick={() => onCommentRemove(id)}
                />
            )}
        </div>
    );
};

export const Comment = styled(CommentContainer)`
    display: flex;
    margin-top: 10px;
    & .comment {
        width: 550px;
        border: 1px solid #000;
        padding: 5px 10px;
    }
    & .information-panel {
        display: flex;
        justify-content: space-between;
    }
    & .author {
        display: flex;
    }
    & .published-at {
        display: flex;
    }
`;

Comment.propTypes = {
    postId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    publishedAt: PropTypes.string,
};
