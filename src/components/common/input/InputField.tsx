import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import { useState } from 'react';

export interface InputProps {
    name?: string;
    label?: string;
    type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'color';
    placeholder?: string;
    isRequired?: boolean;
    value?: string;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onBlur?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onFocus?: (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onKeyPress?: (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    error?: string;
    disabled?: boolean; // For disabled input field
    allowTogglePassword?: boolean;
    startIcon?: React.ReactNode;
    className?: string;
    autoFocus?: boolean;
    isArea?: boolean; // For textarea input
}

const InputField: React.FC<InputProps> = ({
    name,
    label,
    type = 'text',
    placeholder,
    isRequired = false,
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyPress,
    error,
    disabled = false,
    allowTogglePassword = true,
    startIcon,
    className,
    autoFocus = false,
    isArea = false, // For textarea input
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const inputProps = {
        name,
        type:
            type === 'password'
                ? isPasswordVisible
                    ? 'text'
                    : 'password'
                : type,
        placeholder,
        value,
        onChange,
        onBlur,
        onKeyUp: onKeyPress,
        onFocus,
        className: `w-full rounded-lg border-2 px-3 py-2 text-sm text-gray-950 transition-all duration-300 ease-linear outline-none focus:border-purple-400 focus:shadow-md ${error ? 'border-red-400' : 'border-gray-100'} ${disabled ? 'bg-gray-200' : 'bg-white'} ${startIcon && 'pl-10'} ${className}`,
        disabled,
        autoFocus,
    };

    return (
        <div>
            {label && (
                <div className="mb-1 flex gap-x-1 text-sm font-medium text-gray-700">
                    <span>{label}</span>
                    {isRequired && <span className="text-red-500">*</span>}
                </div>
            )}

            <div className="relative flex items-center justify-center">
                {isArea ? (
                    <textarea {...inputProps} />
                ) : (
                    <input {...inputProps} />
                )}
                {startIcon && (
                    <div className="absolute inset-y-0 left-3 flex items-center text-gray-700">
                        <span className="flex size-6 max-w-6 items-center justify-center">
                            {startIcon}
                        </span>
                    </div>
                )}
                {allowTogglePassword && type === 'password' && (
                    <span
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 cursor-pointer">
                        <IconEye
                            className={`transition-all duration-300 ${!isPasswordVisible && 'h-0'}`}
                        />
                        <IconEyeClosed
                            className={`transition-all duration-300 ${isPasswordVisible && 'h-0'}`}
                        />
                    </span>
                )}
            </div>
            <p
                className={`overflow-hidden text-sm font-medium text-red-500 transition-all duration-300 ease-in-out ${error ? 'h-4.5 translate-y-0 opacity-100' : 'h-0 translate-y-1 opacity-0'}`}>
                {error}
            </p>
        </div>
    );
};

export default InputField;
