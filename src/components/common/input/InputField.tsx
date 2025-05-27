import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import { useState } from 'react';

const InputField: React.FC<{
    name?: string;
    label?: string;
    type?: 'text' | 'number' | 'password' | 'email' | 'tel';
    placeholder?: string;
    isRequired?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent) => void;
    error?: string;
    disabled?: boolean; // For disabled input field
    allowTogglePassword?: boolean;
    startIcon?: React.ReactNode;
    className?: string;
}> = ({
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
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
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
                <input
                    name={name}
                    type={
                        type === 'password'
                            ? isPasswordVisible
                                ? 'text'
                                : 'password'
                            : type
                    }
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyUp={onKeyPress}
                    onFocus={onFocus}
                    className={`w-full rounded-lg border-2 px-3 py-2 text-sm text-gray-950 transition-all duration-300 ease-linear outline-none focus:border-purple-400 focus:shadow-md ${error ? 'border-red-400' : 'border-gray-100'} ${disabled ? 'bg-gray-200' : 'bg-white'} ${startIcon && 'pl-10'} ${className}`}
                    disabled={disabled}
                />
                {startIcon && (
                    <span className="absolute inset-y-0 left-3 flex items-center">
                        {startIcon}
                    </span>
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
