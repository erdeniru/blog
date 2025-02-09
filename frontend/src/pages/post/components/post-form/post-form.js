import { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, Icon } from '../../../../components';
import { SpecialPanel } from '../special-panel/special-panel';
import { sanizeContent } from './utils/sanitize-content/sanitize-content';
import { savePostAsync } from '../../../../actions';
import styled from 'styled-components';
import { PROP_TYPE } from '../../../../constants';

const PostFormContainer = ({
    className,
    post: { id, title, imageUrl, content, publishedAt },
}) => {
    const [imageUrlValue, setImageUrlValue] = useState(imageUrl);
    const [titleValue, setTitleValue] = useState(title);
    const contentRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        setImageUrlValue(imageUrl);
        setTitleValue(title);
    }, [imageUrl, title]);

    const onSave = () => {
        const newContent = sanizeContent(contentRef.current.innerHTML);

        dispatch(
            savePostAsync(id, {
                imageUrl: imageUrlValue,
                title: titleValue,
                content: newContent,
            }),
        ).then(({ id }) => {
            navigate(`/post/${id}`);
        });
    };

    const onImageUrlValueChange = ({ target }) => setImageUrlValue(target.value);
    const onTitleValueChange = ({ target }) => setTitleValue(target.value);

    return (
        <div className={className}>
            <Input
                value={imageUrlValue}
                placeholder="Изображение..."
                onChange={onImageUrlValueChange}
            />
            <Input
                value={titleValue}
                placeholder="Заголовок..."
                onChange={onTitleValueChange}
            />
            <SpecialPanel
                id={id}
                publishedAt={publishedAt}
                margin="20px 0"
                editButton={
                    <Icon
                        id="fa-floppy-o"
                        size="21px"
                        margin="0 10px 0 0"
                        onClick={onSave}
                    />
                }
            />
            <div
                ref={contentRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="post-text"
            >
                {content}
            </div>
        </div>
    );
};

export const PostForm = styled(PostFormContainer)`
    & img {
        float: left;
        margin: 0 20px 10px 0;
    }
    & .post-text {
        min-height: 80px;
        border: 1px solid #000;
        font-size: 18px;
        white-space: pre-line;
        padding: 10px;
    }
`;

PostForm.propTypes = {
    post: PROP_TYPE.POST.isRequired,
};
