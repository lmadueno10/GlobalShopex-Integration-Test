import { useState } from 'react';
import NV2HtmlEditor from './NV2HtmlEditor';

/**
 * Example: Using NV2HtmlEditor in a form component
 * 
 * This demonstrates the proper way to integrate the editor
 * into your application with state management.
 */
export default function ProductDescriptionForm() {
    // State to hold the HTML content
    const [description, setDescription] = useState('<p>Enter product description...</p>');
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Example: Send the HTML content to your API
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: description,
                    // ... other form fields
                }),
            });

            if (response.ok) {
                alert('Product saved successfully!');
            }
        } catch (error) {
            console.error('Failed to save product:', error);
            alert('Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handle content changes from the editor
     * This is called every time the user types or makes changes
     */
    const handleEditorChange = (htmlContent) => {
        setDescription(htmlContent);
        console.log('Editor content updated:', htmlContent);
    };

    return (
        <div className="product-form">
            <h2>Product Description Editor</h2>

            <form onSubmit={handleSubmit}>
                {/* Other form fields */}
                <div className="form-group">
                    <label htmlFor="product-name">Product Name</label>
                    <input
                        type="text"
                        id="product-name"
                        placeholder="Enter product name"
                    />
                </div>

                {/* The HTML Editor */}
                <div className="form-group">
                    <label>Description</label>
                    <NV2HtmlEditor
                        value={description}
                        onChange={handleEditorChange}
                        height={400}
                        dlid="dealer-12345"
                    />
                </div>

                {/* Preview the HTML content */}
                <div className="form-group">
                    <label>Preview</label>
                    <div
                        className="preview-box"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
            </form>

            <style jsx>{`
        .product-form {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .preview-box {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 15px;
          min-height: 100px;
          background: #f9f9f9;
        }

        button {
          background: #007bff;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }

        button:hover:not(:disabled) {
          background: #0056b3;
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
