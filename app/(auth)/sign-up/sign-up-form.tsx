'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUp } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { signUpFormSchema } from '@/lib/validations/user.validation';

const SignUpForm = () => {
    const [data, action] = useActionState(signUp, {
        success: false,
        message: '',
    });

    // Состояния для отслеживания видимости паролей
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Состояния для отслеживания ошибок валидации
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Состояния для хранения значений формы
    const [formValues, setFormValues] = useState({
        name: 'Sergio Palomo',
        email: 'email@email.com',
        password: '******',
        confirmPassword: '******'
    });

    // Исходные значения формы для сброса
    const initialFormValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    // Эффект для обработки успешного ответа от сервера
    useEffect(() => {
        if (data.success) {
            // Сбрасываем форму после успешной регистрации
            setFormValues(initialFormValues);
        }
    }, [data.success]);

    // Обработчик изменения полей формы
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        // Сбрасываем предыдущие ошибки
        setErrors({});

        // Валидация с Zod
        const result = signUpFormSchema.safeParse(formValues);

        if (!result.success) {
            // Преобразуем ошибки Zod в удобный формат
            const formattedErrors: Record<string, string> = {};
            result.error.errors.forEach((error) => {
                if (error.path.length > 0) {
                    const path = error.path[0].toString();
                    formattedErrors[path] = error.message;
                }
            });

            setErrors(formattedErrors);
            return false;
        }

        return true;
    };

    const enhancedAction = (formData: FormData) => {
        // Выполняем клиентскую валидацию
        if (!validateForm()) {
            return; // Останавливаем отправку, если есть ошибки
        }

        // Создаем новый FormData объект с контролируемыми значениями
        const enhancedFormData = new FormData();
        Object.entries(formValues).forEach(([key, value]) => {
            enhancedFormData.append(key, value);
        });

        // Добавляем callbackUrl
        enhancedFormData.append('callbackUrl', callbackUrl);

        // Если валидация прошла успешно, отправляем данные
        action(enhancedFormData);
    };

    const SignUpButton = () => {
        const { pending } = useFormStatus();

        return (
            <Button disabled={pending} className='w-full' variant='default' type="submit">
                {pending ? 'Submitting...' : 'Sign Up'}
            </Button>
        );
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <form
            action={enhancedAction}
            className="space-y-6"
        >
            <input type='hidden' name='callbackUrl' value={callbackUrl} />

            <div>
                <Label htmlFor='name'>Name</Label>
                <Input
                    id='name'
                    name='name'
                    type='text'
                    autoComplete='name'
                    value={formValues.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                    id='email'
                    name='email'
                    type='text'
                    autoComplete='email'
                    value={formValues.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            <div>
                <Label htmlFor='password'>Password</Label>
                <div className="relative">
                    <Input
                        id='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete='new-password'
                        value={formValues.password}
                        onChange={handleInputChange}
                        className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        onClick={togglePasswordVisibility}
                        tabIndex={0}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
            </div>

            <div>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <div className="relative">
                    <Input
                        id='confirmPassword'
                        name='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        autoComplete='new-password'
                        value={formValues.confirmPassword}
                        onChange={handleInputChange}
                        className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        onClick={toggleConfirmPasswordVisibility}
                        tabIndex={0}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
            </div>

            <div>
                <SignUpButton />
            </div>

            {data.message && (
                <div className={`text-center ${data.success ? 'text-green-500' : 'text-destructive'}`}>
                    {data.message}
                </div>
            )}

            <div className='text-sm text-center text-muted-foreground'>
                Already have an account?{' '}
                <Link href='/login' target='_self' className='link'>
                    Sign In
                </Link>
            </div>
        </form>
    );
};

export default SignUpForm;