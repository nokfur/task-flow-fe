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
                    className={`mt-1 w-full rounded-lg border bg-white p-3 transition duration-200 focus:border-2 focus:border-teal-500 focus:outline-none ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </label>
        </div>
    );
};

export default TextArea;
