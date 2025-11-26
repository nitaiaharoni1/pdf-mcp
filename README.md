# PDF MCP Server

[![GitHub stars](https://img.shields.io/github/stars/nitaiaharoni1/pdf-mcp?style=social)](https://github.com/nitaiaharoni1/pdf-mcp/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/nitaiaharoni1/pdf-mcp?style=social)](https://github.com/nitaiaharoni1/pdf-mcp/network/members)
[![npm version](https://img.shields.io/npm/v/pdf-mcp)](https://www.npmjs.com/package/pdf-mcp)
[![npm downloads](https://img.shields.io/npm/dm/pdf-mcp)](https://www.npmjs.com/package/pdf-mcp)

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive PDF manipulation capabilities. This server enables natural language interactions with PDF documents through powerful editing, form filling, page manipulation, and security tools.

## 🚀 Quick Install

### NPX (Recommended - No Installation Required)
```bash
# Run directly with npx (no installation needed)
npx pdf-mcp init
npx pdf-mcp status
```

### Global Installation
```bash
# Install globally for repeated use
npm install -g pdf-mcp
pdf-mcp init
pdf-mcp status
```

Restart Claude Desktop after setup.

**✨ New:** Use with NPX - no installation required! Just run `npx pdf-mcp` directly.

## ✨ Features

### 📄 **Document Operations**
- **Open PDFs** - Load and read PDF files with session management
- **Create PDFs** - Generate new blank PDF documents
- **Save PDFs** - Save modified PDFs to file system
- **Get Info** - Retrieve metadata, page count, size, encryption status

### 📝 **Form Operations**
- **List Form Fields** - Discover all form fields with types and values
- **Fill Forms** - Populate text fields, checkboxes, radio buttons, dropdowns
- **Get Form Values** - Export all form data
- **Flatten Forms** - Make form fields non-editable

### ✏️ **Editing Operations**
- **Add Text** - Insert text at specific coordinates with styling
- **Add Images** - Embed images into PDF pages
- **Add Annotations** - Create comments, highlights, and notes
- **Add Watermarks** - Apply text or image watermarks to all pages
- **Modify Metadata** - Update title, author, subject, keywords

### 📑 **Page Operations**
- **List Pages** - Get page dimensions and information
- **Merge PDFs** - Combine multiple PDF documents
- **Split PDFs** - Split PDF into separate files (one per page)
- **Rotate Pages** - Rotate specific pages
- **Delete Pages** - Remove pages from PDF
- **Extract Pages** - Extract pages to new PDF file

### ✍️ **Signature Operations**
- **Visual Signatures** - Add image-based signatures
- **Signature Fields** - Create signature fields in forms
- **Digital Signatures** - Apply digital signatures with certificates (requires implementation)
- **Verify Signatures** - Check existing digital signatures

### 🔒 **Security Operations**
- **Encrypt PDFs** - Add password protection (limited support)
- **Set Permissions** - Control printing, copying, editing permissions
- **Get Security Info** - Check encryption and permission status

### 📤 **Export Operations**
- **Extract Text** - Extract all text content (requires additional implementation)
- **Extract Images** - Extract embedded images (requires additional implementation)
- **Export Form Data** - Export form data to JSON or CSV
- **Compress PDFs** - Optimize PDF file size

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- Claude Desktop or any MCP-compatible AI client

### Quick Setup (NPX - Recommended)

1. **Run directly with NPX (no installation needed):**
   ```bash
   npx pdf-mcp init
   ```

2. **Check status:**
   ```bash
   npx pdf-mcp status
   ```

3. **Restart Claude Desktop** and you're ready!

### Alternative Installation Methods

**Install globally:**
```bash
npm install -g pdf-mcp
pdf-mcp init
```

**Use from source:**
```bash
git clone https://github.com/nitaiaharoni1/pdf-mcp.git
cd pdf-mcp
npm install
npm run build
npm start
```

## 🎯 Available Tools

The PDF MCP server provides 30+ powerful tools for PDF manipulation:

### Document Tools
- **`open_pdf`** - Open and read PDF file information
- **`create_pdf`** - Create new blank PDF or from template
- **`save_pdf`** - Save PDF to file system
- **`close_pdf`** - Close PDF and cleanup resources
- **`get_pdf_info`** - Get metadata, page count, size, encryption status

### Form Tools
- **`list_form_fields`** - List all form fields with types and values
- **`fill_form_field`** - Fill specific form field (text, checkbox, radio, dropdown)
- **`get_form_values`** - Get all current form values
- **`flatten_form`** - Flatten form to make fields non-editable

### Editing Tools
- **`add_text`** - Add text to PDF at coordinates with styling
- **`add_image`** - Insert image into PDF
- **`add_annotation`** - Add comments, highlights, notes
- **`add_watermark`** - Add text or image watermark
- **`modify_metadata`** - Update title, author, subject, keywords

### Page Tools
- **`get_pages`** - List all pages with dimensions
- **`merge_pdfs`** - Combine multiple PDFs
- **`split_pdf`** - Split PDF into separate files
- **`rotate_page`** - Rotate specific pages
- **`delete_pages`** - Remove pages from PDF
- **`extract_pages`** - Extract pages to new PDF

### Signature Tools
- **`add_visual_signature`** - Add image-based signature
- **`create_signature_field`** - Create signature field in form
- **`sign_pdf_digital`** - Apply digital signature with certificate
- **`verify_signature`** - Verify existing digital signatures

### Security Tools
- **`encrypt_pdf`** - Add password protection and permissions
- **`decrypt_pdf`** - Remove password protection
- **`set_permissions`** - Set printing, copying, editing permissions
- **`get_security_info`** - Check encryption and permissions

### Export Tools
- **`extract_text`** - Extract all text content
- **`extract_images`** - Extract embedded images
- **`export_form_data`** - Export form data to JSON/CSV
- **`compress_pdf`** - Optimize PDF file size

## 🖥️ CLI Commands

The pdf-mcp package provides several command-line tools:

### Setup Commands
- **`pdf-mcp init [directory]`** - Initialize PDF working directory
  ```bash
  pdf-mcp init ~/my-pdfs
  pdf-mcp init  # Uses default: ~/pdf-mcp
  ```

### Management Commands
- **`pdf-mcp status`** - Show current configuration and active sessions
  ```bash
  pdf-mcp status
  ```

### Testing Commands
- **`pdf-mcp test [pdf_path]`** - Test PDF operations with a sample PDF
  ```bash
  pdf-mcp test /path/to/sample.pdf
  ```

### Information Commands
- **`pdf-mcp --help/-h`** - Show help information
- **`pdf-mcp --version/-v`** - Show version information

## 💡 Usage Examples

### Basic PDF Operations
```
"Open the PDF at /path/to/document.pdf"
"Create a new PDF document"
"Save the PDF to /path/to/output.pdf"
"Get information about the current PDF"
```

### Form Operations
```
"List all form fields in this PDF"
"Fill the 'name' field with 'John Doe'"
"Get all form values"
"Flatten the form to make it non-editable"
```

### Editing Operations
```
"Add text 'DRAFT' at coordinates 100, 100 on page 1"
"Add an image from /path/to/image.png to page 1"
"Add a watermark 'CONFIDENTIAL' to all pages"
"Update the PDF title to 'My Document'"
```

### Page Operations
```
"List all pages with their dimensions"
"Merge /path/to/file1.pdf and /path/to/file2.pdf"
"Split this PDF into separate files"
"Rotate page 2 by 90 degrees"
"Delete pages 3 and 4"
"Extract pages 1-5 to a new PDF"
```

### Signature Operations
```
"Add a visual signature from /path/to/signature.png to page 1"
"Create a signature field named 'signature' on page 1"
```

### Export Operations
```
"Export form data to /path/to/output.json as JSON"
"Export form data to /path/to/output.csv as CSV"
"Compress this PDF and save to /path/to/compressed.pdf"
```

## 🔧 Configuration

### Environment Variables

- **`PDF_WORKING_DIR`** - Working directory for PDF operations (default: `~/pdf-mcp`)
- **`TEMP_DIR`** - Temporary directory for PDF operations (default: `/tmp/pdf-mcp`)

### File Paths

All file paths must be **absolute paths**. Relative paths are not supported for security reasons.

### Session Management

PDF documents are managed through sessions. Each opened or created PDF gets a unique session ID that is used for subsequent operations. Sessions are automatically cleaned up after 1 hour of inactivity.

## 🧪 Testing

The PDF MCP server includes testing capabilities:

```bash
# Test PDF operations
pdf-mcp test /path/to/sample.pdf

# Run unit tests (if available)
npm test
```

## 🏗️ Development

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nitaiaharoni1/pdf-mcp.git
   cd pdf-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Test locally:**
   ```bash
   npm run dev
   ```

## 📋 Technical Details

### Primary Library
- **pdf-lib** - Comprehensive PDF operations (forms, editing, page manipulation)

### Storage
- Local file system only with absolute path support

### Session Management
- Maintains open PDF documents in memory with unique IDs
- Automatic cleanup of inactive sessions

### Error Handling
- Graceful handling of corrupted PDFs
- Permission error handling
- Unsupported feature detection

### Limitations
- **Digital Signatures**: Requires additional implementation with node-forge
- **Text Extraction**: Requires pdfjs-dist or similar library
- **Image Extraction**: Requires PDF parsing library
- **Encryption**: pdf-lib has limited encryption support

## 📄 License

**MIT License** - See the [LICENSE](LICENSE) file for complete terms and conditions.

## 🙋‍♂️ Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/nitaiaharoni1/pdf-mcp/issues)
- **Documentation**: This README and inline code documentation
- **Community**: Contributions and discussions welcome!

---

**Made with ❤️ for the AI and PDF processing community**
