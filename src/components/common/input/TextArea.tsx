import React from 'react';

const TextArea: React.FC<{
    name: string;
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
}> = ({
    name,
    label,
    placeholder,
    isRequired = false,
    value,
    onChange,
    onBlur,
    error,
}) => {
    return (
        <div>
            <label className="block text-gray-700">
                {label && (
                    <div className="flex gap-x-1 text-sm font-medium">
                        <span>{label}</span>
                        {isRequired && <span className="text-red-500">*</span>}
                    </div>
                )}
                <textarea
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`mt-1 w-full rounded-lg border-2 bg-white p-3 text-sm transition-all duration-300 ease-linear outline-none focus:border-purple-400 focus:shadow-md ${
                        error ? 'border-red-400' : 'border-gray-100'
                    }`}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </label>
        </div>
    );
};

export default TextArea;
