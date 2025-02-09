import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ROLE } from '../../constants';
import { Button, H2, Input } from '../../components';
import { AuthFormError } from '../../components';
import { useResetForm } from '../../hooks';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { request } from '../../utils';
import styled from 'styled-components';

const regFormSchema = yup.object().shape({
    login: yup
        .string()
        .required('Заполните логин')
        .matches(/^\w+$/, 'Неверно заполнен пароль только буквы и цифры')
        .min(3, 'Неверно заполнен пароль. Минимум 3 символа')
        .max(15, 'Неверно заполнен пароль. Максимум 15 символов'),
    password: yup
        .string()
        .required('Заполните пароль')
        .matches(
            /^[\w#%]+$/,
            'Неверно заполнен пароль. Допускаются буквы, цифры и занки № %',
        )
        .min(6, 'Неверно заполнен пароль. Минимум 6 символа')
        .max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
    passcheck: yup
        .string()
        .required('Заполните повторный пароль')
        .oneOf([yup.ref('password'), null], 'Повтор пароля не совпадает'),
});

const RegistrationContainer = ({ className }) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            login: '',
            password: '',
            passcheck: '',
        },
        resolver: yupResolver(regFormSchema),
    });

    const [serverError, setServerError] = useState(null);

    const dispatch = useDispatch();

    const roleId = useSelector(selectUserRole);

    useResetForm(reset);

    const onSubmit = ({ login, password }) => {
        request('/api/register', 'POST', { login, password }).then(({ error, user }) => {
            if (error) {
                setServerError(`Ошибка запроса: ${error}`);
                return;
            }

            dispatch(setUser(user));
            sessionStorage.setItem('userData', JSON.stringify(user));
        });
    };

    const formError =
        errors?.login?.message || errors?.password?.message || errors?.passcheck?.message;
    const errorMessage = formError || serverError;

    if (roleId !== ROLE.GUEST) {
        return <Navigate to="/" />;
    }

    return (
        <div className={className}>
            <H2>Регистрация</H2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="text"
                    placeholder="Логин..."
                    {...register('login', {
                        onChange: () => setServerError(null),
                    })}
                />
                <Input
                    type="password"
                    placeholder="Пароль..."
                    {...register('password', {
                        onChange: () => setServerError(null),
                    })}
                />
                <Input
                    type="password"
                    placeholder="Повторите пароль..."
                    {...register('passcheck', {
                        onChange: () => setServerError(null),
                    })}
                />
                <Button type="submit" disabled={!!formError}>
                    Зарегистрироваться
                </Button>
                {errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
            </form>
        </div>
    );
};

export const Registration = styled(RegistrationContainer)`
    display: flex;
    flex-direction: column;
    align-items: center;

    & > form {
        display: flex;
        flex-direction: column;
        width: 260px;
    }
`;
