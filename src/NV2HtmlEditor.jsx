import { useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BASE_URL_API } from 'services/Http';

const UPLOAD_ENDPOINT = 'upload';

/**
 * CustomUploadAdapter
 * 
 * Handles image uploads for CKEditor 5.
 * Implements the CKEditor UploadAdapter interface.
 * 
 * @see https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
 */
class CustomUploadAdapter {
    /**
     * @param {Object} loader - CKEditor's FileLoader instance
     * @param {string} dlid - Dealer/Location ID for upload authentication
     */
    constructor(loader, dlid) {
        this.loader = loader;
        this.dlid = dlid;
    }

    /**
     * Starts the upload process
     * @returns {Promise} Resolves with { default: imageUrl }
     */
    upload() {
        return this.loader.file.then((file) => {
            return new Promise((resolve, reject) => {
                // Prepare the base URL (remove trailing '/api' from the path)
                // Use regex to only remove '/api' at the end, not 'api' in subdomain
                const baseUrlApi = BASE_URL_API.replace(/\/api$/, '');

                // Create FormData for multipart upload
                const formData = new FormData();
                formData.append('files', file);
                formData.append('baseUrlApi', baseUrlApi);

                // Send the upload request
                fetch(`${baseUrlApi}/${UPLOAD_ENDPOINT}?dlid=${this.dlid}`, {
                    method: 'POST',
                    body: formData,
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Upload failed with status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        // CKEditor expects { default: url } format
                        resolve({
                            default: data.url,
                        });
                    })
                    .catch((error) => {
                        reject(error.message || 'Image upload failed');
                    });
            });
        });
    }

    /**
     * Aborts the upload process (optional but recommended)
     */
    abort() {
        // Can be implemented if you need to cancel uploads
    }
}

/**
 * Creates a plugin function that registers the custom upload adapter
 * 
 * @param {string} dlid - Dealer/Location ID
 * @returns {Function} CKEditor plugin function
 */
function createUploadAdapterPlugin(dlid) {
    return function (editor) {
        // Register our custom adapter with CKEditor's FileRepository
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new CustomUploadAdapter(loader, dlid);
        };
    };
}

/**
 * NV2HtmlEditor
 * 
 * A clean, modern wrapper around CKEditor 5 Classic Editor.
 * Provides a controlled component interface with custom image upload support.
 * 
 * Features:
 * - Custom upload adapter for image uploads
 * - Configurable editor height
 * - Fully controlled component (value/onChange pattern)
 * - Automatic DLID fallback to localStorage
 * - Clean, maintainable code structure
 * 
 * @component
 * @example
 * ```jsx
 * <NV2HtmlEditor
 *   value={content}
 *   onChange={(html) => setContent(html)}
 *   height={400}
 *   dlid="dealer-123"
 * />
 * ```
 */
export default function NV2HtmlEditor({
    value = '',
    onChange,
    height = 500,
    dlid
}) {
    // Store reference to the editor instance
    const editorRef = useRef(null);

    // Use provided dlid or fall back to localStorage
    const effectiveDlid = dlid || localStorage.getItem('_dlid') || '';

    /**
     * Update editor height when the height prop changes
     * This ensures the editor is responsive to prop updates
     */
    useEffect(() => {
        if (editorRef.current) {
            const editableElement = editorRef.current.editing.view.document.getRoot();
            editorRef.current.editing.view.change((writer) => {
                writer.setStyle('height', `${height}px`, editableElement);
            });
        }
    }, [height]);

    /**
     * Called when the editor is ready
     * Sets the initial height and stores the editor reference
     */
    const handleReady = (editor) => {
        editorRef.current = editor;

        // Set initial height on the editable area
        const editableElement = editor.editing.view.document.getRoot();
        editor.editing.view.change((writer) => {
            writer.setStyle('height', `${height}px`, editableElement);
        });
    };

    /**
     * Called whenever the editor content changes
     * Propagates the HTML content to the parent component
     */
    const handleChange = (event, editor) => {
        const htmlContent = editor.getData();

        // Only call onChange if it's provided
        if (onChange) {
            onChange(htmlContent);
        }
    };

    /**
     * CKEditor configuration object
     */
    const editorConfig = {
        // Register our custom upload adapter plugin
        extraPlugins: [createUploadAdapterPlugin(effectiveDlid)],

        // Customize the toolbar
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
        <div className="nv2-html-editor">
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
