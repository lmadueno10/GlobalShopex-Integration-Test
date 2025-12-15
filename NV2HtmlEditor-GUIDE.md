# NV2HtmlEditor - Implementation Guide

## 📦 Component Overview

**NV2HtmlEditor** is a modern, production-ready React wrapper for CKEditor 5 Classic Editor with custom image upload support.

### ✨ Key Features

- ✅ Clean, maintainable code structure
- ✅ Custom upload adapter for image uploads
- ✅ Fully controlled component (value/onChange pattern)
- ✅ Configurable editor height with reactive updates
- ✅ Automatic DLID fallback to localStorage
- ✅ Proper error handling
- ✅ No deprecated API calls
- ✅ Modern React patterns (hooks, refs)

---

## 📥 Installation

Make sure you have the required dependencies:

```bash
npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
```

---

## 🚀 Basic Usage

### Simple Example

```jsx
import { useState } from 'react';
import NV2HtmlEditor from './NV2HtmlEditor';

function MyComponent() {
  const [content, setContent] = useState('<p>Hello World!</p>');

  return (
    <NV2HtmlEditor
      value={content}
      onChange={setContent}
      height={400}
      dlid="dealer-123"
    />
  );
}
```

### With Form Integration

```jsx
import { useState } from 'react';
import NV2HtmlEditor from './NV2HtmlEditor';

function ArticleForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const article = { title, body };
    
    // Send to your API
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article Title"
      />
      
      <NV2HtmlEditor
        value={body}
        onChange={setBody}
        height={500}
      />
      
      <button type="submit">Publish</button>
    </form>
  );
}
```

---

## 🎛️ Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | The HTML content to display in the editor |
| `onChange` | `function` | `undefined` | Callback fired when content changes. Receives HTML string as argument |
| `height` | `number` | `500` | Editor height in pixels |
| `dlid` | `string` | `localStorage._dlid` | Dealer/Location ID for image uploads |

### Prop Details

#### `value` (string)
The HTML content displayed in the editor. This is a **controlled component**, so you must manage this state in the parent.

```jsx
const [content, setContent] = useState('<p>Initial content</p>');

<NV2HtmlEditor value={content} onChange={setContent} />
```

#### `onChange` (function)
Called whenever the editor content changes. Receives the updated HTML string.

```jsx
<NV2HtmlEditor
  value={content}
  onChange={(html) => {
    console.log('Content updated:', html);
    setContent(html);
  }}
/>
```

#### `height` (number)
Controls the height of the editor's editable area in pixels. The editor will update if this prop changes.

```jsx
<NV2HtmlEditor height={600} />
```

#### `dlid` (string)
Dealer/Location ID used for authenticating image uploads. If not provided, falls back to `localStorage.getItem('_dlid')`.

```jsx
<NV2HtmlEditor dlid="dealer-12345" />
```

---

## 📤 Image Upload

The component includes a custom upload adapter that handles image uploads.

### Upload Flow

1. User inserts an image via the toolbar
2. Image is uploaded to: `POST {baseUrl}/upload?dlid={dlid}`
3. Server responds with: `{ url: "https://..." }`
4. Image is inserted into the editor

### Upload Endpoint Requirements

Your backend endpoint should:

- Accept `POST` requests
- Receive `multipart/form-data` with a `files` field
- Accept `dlid` as a query parameter
- Return JSON: `{ url: "https://example.com/image.jpg" }`

### Example Backend (Express.js)

```javascript
app.post('/upload', upload.single('files'), (req, res) => {
  const dlid = req.query.dlid;
  const file = req.file;
  
  // Save file and get URL
  const fileUrl = saveFile(file, dlid);
  
  res.json({ url: fileUrl });
});
```

---

## 🎨 Customization

### Toolbar Configuration

You can customize the toolbar by modifying the `editorConfig` object in `NV2HtmlEditor.jsx`:

```javascript
const editorConfig = {
  extraPlugins: [createUploadAdapterPlugin(effectiveDlid)],
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    // Add or remove items here
  ],
};
```

### Styling

Add custom styles by targeting the wrapper class:

```css
.nv2-html-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.nv2-html-editor .ck-editor__editable {
  font-family: 'Arial', sans-serif;
}
```

---

## 🔧 Migration from Old Component

### Before (HtmlEditor)

```jsx
<HtmlEditor
  title="Description"
  data={description}
  onBlur={(value) => setDescription(value)}
  height={500}
  dlid="dealer-123"
/>
```

### After (NV2HtmlEditor)

```jsx
<div>
  <h5>Description</h5>
  <NV2HtmlEditor
    value={description}
    onChange={setDescription}
    height={500}
    dlid="dealer-123"
  />
</div>
```

### Key Differences

| Old | New | Reason |
|-----|-----|--------|
| `data` prop | `value` prop | React convention for controlled inputs |
| `onBlur` callback | `onChange` callback | Real-time updates instead of on blur |
| `title` prop | Separate `<h5>` | Separation of concerns |
| Internal state | Fully controlled | Better state management |

---

## ⚠️ Common Issues

### Issue: Editor height not updating

**Solution**: Make sure you're passing a number, not a string:

```jsx
// ❌ Wrong
<NV2HtmlEditor height="400" />

// ✅ Correct
<NV2HtmlEditor height={400} />
```

### Issue: Upload fails with CORS error

**Solution**: Ensure your backend allows CORS for the upload endpoint:

```javascript
app.use('/upload', cors());
```

### Issue: Content not updating

**Solution**: Make sure you're using a controlled pattern:

```jsx
// ❌ Wrong - no state management
<NV2HtmlEditor value="<p>Static</p>" />

// ✅ Correct - controlled component
const [content, setContent] = useState('<p>Initial</p>');
<NV2HtmlEditor value={content} onChange={setContent} />
```

---

## 📚 Additional Resources

- [CKEditor 5 Documentation](https://ckeditor.com/docs/ckeditor5/latest/)
- [Upload Adapter Guide](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html)
- [CKEditor React Integration](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html)

---

## 📝 License

This component is part of your internal codebase. Refer to your project's license.
