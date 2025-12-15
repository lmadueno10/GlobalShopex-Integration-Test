import { useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BASE_URL_API } from 'services/Http';

const UPLOAD_ENDPOINT = 'upload';

/**
 * Custom upload adapter for CKEditor image uploads
 */
class CustomUploadAdapter {
    constructor(loader, dlid) {
        this.loader = loader;
        this.dlid = dlid;
    }

    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    const baseUrlApi = BASE_URL_API.replace('api', '');
                    const formData = new FormData();

                    formData.append('files', file);
                    formData.append('baseUrlApi', baseUrlApi);

                    fetch(`${baseUrlApi}${UPLOAD_ENDPOINT}?dlid=${this.dlid}`, {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Upload failed: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then((data) => {
                            resolve({
                                default: data.url,
                            });
                        })
                        .catch((error) => {
                            reject(error.message || 'Upload failed');
                        });
                })
        );
    }

    abort() {
        // Optional: implement abort logic if needed
    }
}

/**
 * Plugin factory function to register the custom upload adapter
 */
function createUploadAdapterPlugin(dlid) {
    return function (editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new CustomUploadAdapter(loader, dlid);
        };
    };
}

/**
 * RichTextEditor - A clean CKEditor 5 wrapper component
 *
 * @param {Object} props
 * @param {string} props.value - The HTML content value
 * @param {Function} props.onChange - Callback when content changes (receives HTML string)
 * @param {number} props.height - Editor height in pixels (default: 500)
 * @param {string} props.dlid - Dealer/location ID for uploads (optional, falls back to localStorage)
 */
export default function RichTextEditor({ value = '', onChange, height = 500, dlid }) {
    const editorRef = useRef(null);
    const effectiveDlid = dlid || localStorage.getItem('_dlid') || '';

    // Apply height to editor after it's ready
    useEffect(() => {
        if (editorRef.current) {
            const editableElement = editorRef.current.editing.view.document.getRoot();
            editorRef.current.editing.view.change((writer) => {
                writer.setStyle('height', `${height}px`, editableElement);
            });
        }
    }, [height]);

    const handleReady = (editor) => {
        editorRef.current = editor;

        // Set initial height
        const editableElement = editor.editing.view.document.getRoot();
        editor.editing.view.change((writer) => {
            writer.setStyle('height', `${height}px`, editableElement);
        });
    };

    const handleChange = (event, editor) => {
        const data = editor.getData();
        if (onChange) {
            onChange(data);
        }
    };

    const editorConfig = {
        extraPlugins: [createUploadAdapterPlugin(effectiveDlid)],
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            'undo',
            'redo',
        ],
    };

    return (
        <div className="rich-text-editor">
            <CKEditor
                editor={ClassicEditor}
                data={value}
                config={editorConfig}
                onReady={handleReady}
                onChange={handleChange}
            />
        </div>
    );
}
