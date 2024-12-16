import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface QuillEditorProps {
    value: string;
    onChange: (content: string) => void;
    modules?: Record<string, unknown>; // Ensure this is typed correctly
    placeholder?: string;
    className?: string;
    theme?: string; // Add other props as necessary
}

const QuillEditor = React.forwardRef<ReactQuill, QuillEditorProps>(({
    value,
    onChange,
    modules,
    placeholder,
    className,
    theme = 'snow',
}, ref) => {
    return (
        <ReactQuill
            ref={ref} // Pass the ref to the ReactQuill component
            value={value}
            onChange={onChange}
            modules={modules}
            placeholder={placeholder}
            className={className}
            theme={theme}
        />
    );
});

// Set display name for easier debugging
QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
