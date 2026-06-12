// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.section');
    const toolRoutes = {
        'json-formatter': 'json',
        'json-compare': 'compare',
        'text-compare': 'textCompare',
        'image-editor': 'image',
        'base64-converter': 'base64',
        'hash-generator': 'hash',
        'text-summary': 'text',
        'file-analyzer': 'fileAnalyzer',
        'irctc-checker': 'irctc',
        'jwt-decoder': 'jwt',
        'url-encoder-decoder': 'url',
        'timestamp-converter': 'timestamp',
        'uuid-generator': 'uuid',
        'qr-code-generator': 'qr',
        'yaml-json-converter': 'yamlJson',
        'csv-json-converter': 'csvJson',
        'xml-formatter': 'xml',
        'regex-tester': 'regex'
    };
    const tabRoutes = Object.fromEntries(Object.entries(toolRoutes).map(([slug, tab]) => [tab, slug]));
    const bindClick = (id, handler) => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('click', handler);
    };

    function activateToolTab(tab, updateRoute = false, runCleanup = true) {
        tabButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        const activeButton = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
        const targetSection = document.getElementById(`${tab}Section`);
        if (!activeButton || !targetSection) return;

        activeButton.classList.add('active');
        targetSection.classList.add('active');
        if (runCleanup) {
            cleanupInactiveSections(tab);
        }

        if (updateRoute) {
            updateToolRoute(tab);
        }
    }

    function getToolTabFromLocation() {
        const hashSlug = window.location.hash.replace('#', '');
        if (toolRoutes[hashSlug]) return toolRoutes[hashSlug];

        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1] || '';
        const slug = lastPart.replace(/\.html$/, '');
        return toolRoutes[slug] || 'json';
    }

    function updateToolRoute(tab) {
        const slug = tabRoutes[tab] || 'json-formatter';
        const cleanPathAllowed = window.location.hostname === 'tools.propsanchal.com';
        const url = cleanPathAllowed ? `/${slug}` : `${window.location.pathname}#${slug}`;
        window.history.pushState({ tab }, '', url);
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            activateToolTab(tab, true);
        });
    });

    window.addEventListener('popstate', () => {
        activateToolTab(getToolTabFromLocation(), false);
    });

    activateToolTab(getToolTabFromLocation(), false, false);

    // JSON Formatter
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatBtn = document.getElementById('formatBtn');
    const expandAllBtn = document.getElementById('expandAll');
    const collapseAllBtn = document.getElementById('collapseAll');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');
    const exportOptions = document.getElementById('exportOptions');
    const exportFilename = document.getElementById('exportFilename');
    const exportWithNameBtn = document.getElementById('exportWithNameBtn');
    const cancelExportBtn = document.getElementById('cancelExportBtn');

    formatBtn.addEventListener('click', formatJSON);
    expandAllBtn.addEventListener('click', () => toggleAll(true));
    collapseAllBtn.addEventListener('click', () => toggleAll(false));
    copyBtn.addEventListener('click', copyToClipboard);
    exportBtn.addEventListener('click', showExportOptions);
    
    if (exportWithNameBtn) {
        exportWithNameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            exportJSONWithName();
        });
    }
    
    if (cancelExportBtn) {
        cancelExportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideExportOptions();
        });
    }

    // JSON Compare
    const json1Input = document.getElementById('json1Input');
    const json2Input = document.getElementById('json2Input');
    const compareBtn = document.getElementById('compareBtn');
    const clearCompareBtn = document.getElementById('clearCompareBtn');
    const matchScore = document.getElementById('matchScore');
    const differencesList = document.getElementById('differencesList');

    compareBtn.addEventListener('click', compareJSONs);
    clearCompareBtn.addEventListener('click', clearCompare);
    
    // Auto-format JSON inputs on blur
    json1Input.addEventListener('blur', () => autoFormatInput(json1Input));
    json2Input.addEventListener('blur', () => autoFormatInput(json2Input));
    
    // Also format on paste
    json1Input.addEventListener('paste', (e) => {
        setTimeout(() => autoFormatInput(json1Input), 10);
    });
    json2Input.addEventListener('paste', (e) => {
        setTimeout(() => autoFormatInput(json2Input), 10);
    });

    // Text Compare
    const text1Input = document.getElementById('text1Input');
    const text2Input = document.getElementById('text2Input');
    const compareTextBtn = document.getElementById('compareTextBtn');
    const clearTextCompareBtn = document.getElementById('clearTextCompareBtn');
    
    if (compareTextBtn) {
        compareTextBtn.addEventListener('click', function() {
            console.log('Compare button clicked');
            compareTexts();
        });
    }
    
    if (clearTextCompareBtn) {
        clearTextCompareBtn.addEventListener('click', clearTextCompare);
    }
    
    // Real-time stats update
    if (text1Input) {
        text1Input.addEventListener('input', () => updateTextStats(text1Input, 'text1'));
    }
    if (text2Input) {
        text2Input.addEventListener('input', () => updateTextStats(text2Input, 'text2'));
    }

    // Base64 Converter
    const textToEncode = document.getElementById('textToEncode');
    const fileToEncode = document.getElementById('fileToEncode');
    const encodeFileName = document.getElementById('encodeFileName');
    const encodeBtn = document.getElementById('encodeBtn');
    const base64Output = document.getElementById('base64Output');
    const copyBase64Btn = document.getElementById('copyBase64Btn');
    const base64ToDecodeText = document.getElementById('base64ToDecodeText');
    const decodeTextBtn = document.getElementById('decodeTextBtn');
    const decodedTextOutput = document.getElementById('decodedTextOutput');
    const base64ToDecodeFile = document.getElementById('base64ToDecodeFile');
    const decodeFileBtn = document.getElementById('decodeFileBtn');
    const previewFileBtn = document.getElementById('previewFileBtn');
    const previewArea = document.getElementById('previewArea');

    fileToEncode.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            encodeFileName.textContent = e.target.files[0].name;
        }
    });
    encodeBtn.addEventListener('click', encodeToBase64);
    copyBase64Btn.addEventListener('click', () => copyToClipboardGeneric(base64Output));
    decodeTextBtn.addEventListener('click', decodeBase64Text);
    previewFileBtn.addEventListener('click', previewBase64File);
    decodeFileBtn.addEventListener('click', decodeBase64File);
    
    document.getElementById('resetEncodeBtn').addEventListener('click', resetEncode);
    document.getElementById('resetDecodeBtn').addEventListener('click', resetDecode);

    // Hash Generator
    const textToHash = document.getElementById('textToHash');
    const fileToHash = document.getElementById('fileToHash');
    const hashFileName = document.getElementById('hashFileName');
    const generateSHA256Btn = document.getElementById('generateSHA256Btn');
    const generateSHA512Btn = document.getElementById('generateSHA512Btn');
    const generateBothBtn = document.getElementById('generateBothBtn');
    const sha256Output = document.getElementById('sha256Output');
    const sha512Output = document.getElementById('sha512Output');
    const copyHashBtns = document.querySelectorAll('.copy-hash-btn');
    
    // Fixed Parameters
    const clientCode = document.getElementById('clientCode');
    const requestId = document.getElementById('requestId');
    const apiKey = document.getElementById('apiKey');
    const salt = document.getElementById('salt');
    const hashStringOutput = document.getElementById('hashStringOutput');
    const generateParamHashBtn = document.getElementById('generateParamHashBtn');
    const refreshRequestIdBtn = document.getElementById('refreshRequestIdBtn');

    fileToHash.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            hashFileName.textContent = e.target.files[0].name;
        }
    });
    generateSHA256Btn.addEventListener('click', () => generateHash('SHA-256'));
    generateSHA512Btn.addEventListener('click', () => generateHash('SHA-512'));
    generateBothBtn.addEventListener('click', () => generateHash('both'));
    
    generateParamHashBtn.addEventListener('click', generateHashFromParams);
    refreshRequestIdBtn.addEventListener('click', generateRequestId);
    
    // Auto-generate requestId on load
    generateRequestId();
    
    // Update hash string preview when inputs change
    [clientCode, apiKey, salt].forEach(input => {
        input.addEventListener('input', updateHashStringPreview);
    });
    
    copyHashBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            copyToClipboardGeneric(input, this);
        });
    });
    
    document.getElementById('resetHashBtn').addEventListener('click', resetHash);

    // Text Summary
    const textAnalysisInput = document.getElementById('textAnalysisInput');
    const analyzeTextBtn = document.getElementById('analyzeTextBtn');
    const resetTextBtn = document.getElementById('resetTextBtn');
    
    analyzeTextBtn.addEventListener('click', analyzeText);
    resetTextBtn.addEventListener('click', resetTextAnalysis);
    
    // Real-time analysis on input
    textAnalysisInput.addEventListener('input', analyzeText);

    // Additional utility tools
    bindClick('decodeJwtBtn', decodeJWT);
    bindClick('copyJwtPayloadBtn', () => copyElementText('jwtPayloadOutput'));
    bindClick('clearJwtBtn', clearJWT);

    bindClick('encodeUrlBtn', () => transformURL('encode'));
    bindClick('decodeUrlBtn', () => transformURL('decode'));
    bindClick('copyUrlOutputBtn', () => copyElementText('urlOutput'));
    bindClick('clearUrlBtn', clearURLTool);

    bindClick('timestampNowBtn', setTimestampNow);
    bindClick('timestampToDateBtn', timestampToDate);
    bindClick('dateToTimestampBtn', dateToTimestamp);
    bindClick('clearTimestampBtn', clearTimestampTool);

    bindClick('generateUuidBtn', generateUUIDs);
    bindClick('copyUuidBtn', () => copyElementText('uuidOutput'));
    bindClick('clearUuidBtn', clearUUIDTool);

    bindClick('generateQrBtn', generateQRCode);
    bindClick('downloadQrBtn', downloadQRCode);
    bindClick('clearQrBtn', clearQRCode);

    bindClick('yamlToJsonBtn', yamlToJSON);
    bindClick('jsonToYamlBtn', jsonToYAML);
    bindClick('copyYamlJsonBtn', () => copyElementText('yamlJsonOutput'));
    bindClick('clearYamlJsonBtn', clearYamlJsonTool);

    bindClick('csvToJsonBtn', csvToJSON);
    bindClick('jsonToCsvBtn', jsonToCSV);
    bindClick('copyCsvJsonBtn', () => copyElementText('csvJsonOutput'));
    bindClick('clearCsvJsonBtn', clearCsvJsonTool);

    bindClick('formatXmlBtn', formatXMLTool);
    bindClick('minifyXmlBtn', minifyXMLTool);
    bindClick('copyXmlBtn', () => copyElementText('xmlOutput'));
    bindClick('clearXmlBtn', clearXMLTool);

    bindClick('runRegexBtn', runRegexTester);
    bindClick('copyRegexBtn', () => copyElementText('regexOutput'));
    bindClick('clearRegexBtn', clearRegexTool);

    // File Analyzer
    const fileAnalyzerInput = document.getElementById('fileAnalyzerInput');
    const fileDropArea = document.getElementById('fileDropArea');
    const resetFileAnalyzerBtn = document.getElementById('resetFileAnalyzerBtn');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    
    let currentFile = null;
    let currentFileType = null;
    
    fileDropArea.addEventListener('click', () => fileAnalyzerInput.click());
    fileAnalyzerInput.addEventListener('change', handleFileAnalyzer);
    resetFileAnalyzerBtn.addEventListener('click', resetFileAnalyzer);
    
    // Drag and drop
    fileDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropArea.style.borderColor = '#667eea';
        fileDropArea.style.background = '#edf2f7';
    });
    
    fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.style.borderColor = '#cbd5e0';
        fileDropArea.style.background = 'white';
    });
    
    fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.style.borderColor = '#cbd5e0';
        fileDropArea.style.background = 'white';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileAnalyzerInput.files = files;
            handleFileAnalyzer();
        }
    });
    
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = Math.round(e.target.value * 100) + '%';
    });
    
    // Conversion buttons
    document.addEventListener('click', (e) => {
        const jsonActionButton = e.target.closest('[data-json-action]');
        if (jsonActionButton) {
            handleJSONValueAction(jsonActionButton);
            return;
        }

        if (e.target.classList.contains('convert-btn')) {
            const format = e.target.getAttribute('data-format');
            convertFile(format);
        }
    });

    // Image Editor
    const imageInput = document.getElementById('imageInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const imageFileName = document.getElementById('imageFileName');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');

    uploadBtn.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageUpload);

    document.getElementById('rotateLeft').addEventListener('click', () => rotateImage(-90));
    document.getElementById('rotateRight').addEventListener('click', () => rotateImage(90));
    document.getElementById('flipH').addEventListener('click', flipImageH);
    document.getElementById('flipV').addEventListener('click', flipImageV);
    document.getElementById('invertBtn').addEventListener('click', invertColors);
    document.getElementById('grayscaleBtn').addEventListener('click', applyGrayscale);
    document.getElementById('brightenBtn').addEventListener('click', () => adjustBrightness(30));
    document.getElementById('darkenBtn').addEventListener('click', () => adjustBrightness(-30));
    document.getElementById('enableCrop').addEventListener('click', enableCropMode);
    document.getElementById('applyCrop').addEventListener('click', applyCrop);
    document.getElementById('cancelCrop').addEventListener('click', cancelCrop);
    document.getElementById('resetBtn').addEventListener('click', resetImage);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);

    canvas.addEventListener('mousedown', startCrop);
    canvas.addEventListener('mousemove', drawCropArea);
    canvas.addEventListener('mouseup', endCrop);

// Global variables
let parsedData = null;
let jsonValueRegistry = new Map();
let originalImage = null;
let currentImage = null;
let rotation = 0;
let flipHorizontal = 1;
let flipVertical = 1;
let cropMode = false;
let cropStart = null;
let cropEnd = null;
let isDrawing = false;
let savedImageData = null;

// Performance optimization: Cleanup function
function cleanupInactiveSections(activeTab) {
    // Clear canvas when leaving image editor
    if (activeTab !== 'image' && originalImage) {
        const canvas = document.getElementById('imageCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        savedImageData = null;
    }
    
    // Clear preview areas when not in use
    if (activeTab !== 'base64') {
        const previewArea = document.getElementById('previewArea');
        if (previewArea) previewArea.innerHTML = '';
    }
    
    if (activeTab !== 'fileAnalyzer') {
        const filePreviewArea = document.getElementById('filePreviewArea');
        if (filePreviewArea) filePreviewArea.innerHTML = '';
    }
}

function formatJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        jsonOutput.innerHTML = '<div class="error-message">Please enter JSON data</div>';
        return;
    }
    
    try {
        parsedData = JSON.parse(input);
        jsonValueRegistry.clear();
        
        // Use requestAnimationFrame for smoother rendering
        requestAnimationFrame(() => {
            jsonOutput.innerHTML = renderJSON(parsedData, 0, '$');
            attachToggleListeners();
        });
    } catch (error) {
        jsonOutput.innerHTML = `<div class="error-message">Invalid JSON: ${error.message}</div>`;
    }
}

function renderJSON(data, level = 0, path = '$') {
    const indent = level * 20;
    
    if (data === null) {
        return renderJSONValue(data, '<span class="json-null">null</span>', path);
    }
    
    if (typeof data === 'string') {
        // Truncate very long strings for performance
        const displayStr = data.length > 1000 ? data.substring(0, 1000) + '...' : data;
        return renderJSONValue(data, `<span class="json-string">"${escapeHtml(displayStr)}"</span>`, path);
    }
    
    if (typeof data === 'number') {
        return renderJSONValue(data, `<span class="json-number">${data}</span>`, path);
    }
    
    if (typeof data === 'boolean') {
        return renderJSONValue(data, `<span class="json-boolean">${data}</span>`, path);
    }
    
    if (Array.isArray(data)) {
        if (data.length === 0) {
            return renderJSONValue(data, '<span>[]</span>', path);
        }
        
        const id = generateId();
        const valueId = registerJSONValue(data, path);
        let html = `<div class="json-line">`;
        html += `<span class="json-toggle" data-id="${id}">▼</span>`;
        html += `<span>[${data.length} items]</span>`;
        html += renderJSONActions(valueId);
        html += `</div>`;
        html += `<div class="json-content" id="${id}" style="padding-left: ${indent + 20}px">`;
        
        // Limit rendering for very large arrays
        const maxItems = data.length > 100 ? 100 : data.length;
        for (let i = 0; i < maxItems; i++) {
            const childPath = `${path}[${i}]`;
            html += `<div class="json-line">`;
            html += `<span class="json-key">[${i}]:</span> `;
            html += renderJSON(data[i], level + 1, childPath);
            html += `</div>`;
        }
        
        if (data.length > 100) {
            html += `<div class="json-line"><span class="json-truncated">... ${data.length - 100} more items</span></div>`;
        }
        
        html += `</div>`;
        return html;
    }
    
    if (typeof data === 'object') {
        const keys = Object.keys(data);
        
        if (keys.length === 0) {
            return renderJSONValue(data, '<span>{}</span>', path);
        }
        
        const id = generateId();
        const valueId = registerJSONValue(data, path);
        let html = `<div class="json-line">`;
        html += `<span class="json-toggle" data-id="${id}">▼</span>`;
        html += `<span>{${keys.length} keys}</span>`;
        html += renderJSONActions(valueId);
        html += `</div>`;
        html += `<div class="json-content" id="${id}" style="padding-left: ${indent + 20}px">`;
        
        keys.forEach(key => {
            const childPath = `${path}.${key}`;
            html += `<div class="json-line">`;
            html += `<span class="json-key">"${escapeHtml(key)}":</span> `;
            html += renderJSON(data[key], level + 1, childPath);
            html += `</div>`;
        });
        
        html += `</div>`;
        return html;
    }
    
    return String(data);
}

function renderJSONValue(value, valueMarkup, path) {
    const valueId = registerJSONValue(value, path);
    return `<span class="json-value-wrap" data-json-value-id="${valueId}">${valueMarkup}${renderJSONActions(valueId)}</span>`;
}

function registerJSONValue(value, path) {
    const id = generateId();
    jsonValueRegistry.set(id, {
        value,
        path,
        copyValue: getJSONCopyValue(value),
        file: getPreviewableBase64File(value)
    });
    return id;
}

function getJSONCopyValue(value) {
    if (typeof value === 'string') return value;
    if (value === null) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
}

function renderJSONActions(valueId) {
    const valueRecord = jsonValueRegistry.get(valueId);
    const fileActions = valueRecord && valueRecord.file ? `
        <button type="button" class="json-action-btn" data-json-action="preview" data-json-value-id="${valueId}" title="Show file preview">Show File</button>
        <button type="button" class="json-icon-btn" data-json-action="download" data-json-value-id="${valueId}" title="Download file">↓</button>
    ` : '';

    return `
        <span class="json-value-actions">
            <button type="button" class="json-action-btn" data-json-action="copy" data-json-value-id="${valueId}" title="Copy full value">Copy</button>
            ${fileActions}
        </span>
    `;
}

function getPreviewableBase64File(value) {
    if (typeof value !== 'string') return null;

    try {
        const processed = processBase64(value.trim());
        const isPreviewable = processed.mimeType.startsWith('image/') || processed.mimeType === 'application/pdf';
        if (!isPreviewable) return null;

        return {
            dataUrl: processed.dataUrl,
            mimeType: processed.mimeType,
            extension: getExtensionFromMime(processed.mimeType)
        };
    } catch (error) {
        return null;
    }
}

function handleJSONValueAction(button) {
    const action = button.getAttribute('data-json-action');

    if (action === 'close-preview') {
        const preview = button.closest('.json-inline-preview');
        if (preview) preview.remove();
        return;
    }

    const valueId = button.getAttribute('data-json-value-id');
    const valueRecord = jsonValueRegistry.get(valueId);
    if (!valueRecord) {
        alert('This JSON value is no longer available. Please format the JSON again.');
        return;
    }

    if (action === 'copy') {
        copyJSONValue(valueRecord, button);
    } else if (action === 'preview') {
        showJSONFilePreview(valueId, valueRecord, button);
    } else if (action === 'download') {
        downloadJSONFile(valueRecord);
    }
}

function copyJSONValue(valueRecord, button) {
    navigator.clipboard.writeText(valueRecord.copyValue).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied';
        button.disabled = true;
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1600);
    }).catch(() => {
        alert('Unable to copy value. Please try again.');
    });
}

function showJSONFilePreview(valueId, valueRecord, button) {
    if (!valueRecord.file) return;

    const existingPreview = jsonOutput.querySelector(`[data-json-preview-for="${valueId}"]`);
    if (existingPreview) {
        existingPreview.remove();
    }

    const file = valueRecord.file;
    const previewBody = file.mimeType === 'application/pdf'
        ? `<embed src="${file.dataUrl}" type="application/pdf" class="json-inline-preview-pdf">`
        : `<img src="${file.dataUrl}" alt="Decoded JSON value preview" class="json-inline-preview-image">`;

    const previewHTML = `
        <div class="json-inline-preview" data-json-preview-for="${valueId}">
            <div class="json-inline-preview-header">
                <span>${escapeHtml(file.mimeType)}</span>
                <div class="json-inline-preview-actions">
                    <button type="button" class="json-icon-btn" data-json-action="download" data-json-value-id="${valueId}" title="Download file">↓</button>
                    <button type="button" class="json-action-btn" data-json-action="close-preview">Close</button>
                </div>
            </div>
            ${previewBody}
        </div>
    `;

    const line = button.closest('.json-line');
    if (line) {
        line.insertAdjacentHTML('afterend', previewHTML);
    } else {
        button.closest('.json-value-wrap').insertAdjacentHTML('afterend', previewHTML);
    }
}

function downloadJSONFile(valueRecord) {
    if (!valueRecord.file) return;

    const link = document.createElement('a');
    const cleanPath = valueRecord.path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'json-value';
    link.href = valueRecord.file.dataUrl;
    link.download = `${cleanPath}.${valueRecord.file.extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getExtensionFromMime(mimeType) {
    const extensions = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'application/pdf': 'pdf'
    };
    return extensions[mimeType] || 'bin';
}

function attachToggleListeners() {
    const toggles = jsonOutput.querySelectorAll('.json-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-id');
            const content = document.getElementById(targetId);
            
            if (content.classList.contains('json-collapsed')) {
                content.classList.remove('json-collapsed');
                this.textContent = '▼';
            } else {
                content.classList.add('json-collapsed');
                this.textContent = '▶';
            }
        });
    });
}

function toggleAll(expand) {
    const contents = jsonOutput.querySelectorAll('.json-content');
    const toggles = jsonOutput.querySelectorAll('.json-toggle');
    
    contents.forEach(content => {
        if (expand) {
            content.classList.remove('json-collapsed');
        } else {
            content.classList.add('json-collapsed');
        }
    });
    
    toggles.forEach(toggle => {
        toggle.textContent = expand ? '▼' : '▶';
    });
}



function copyToClipboard() {
    if (!parsedData) {
        alert('No JSON to copy');
        return;
    }
    
    const formatted = JSON.stringify(parsedData, null, 2);
    navigator.clipboard.writeText(formatted).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}

function exportJSON() {
    if (!parsedData) {
        alert('No JSON to export');
        return;
    }
    
    const formatted = JSON.stringify(parsedData, null, 2);
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
    
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Exported!';
    setTimeout(() => {
        exportBtn.textContent = originalText;
    }, 2000);
}

function showExportOptions() {
    if (!parsedData) {
        alert('Please format JSON first before exporting');
        return;
    }
    const exportOptionsEl = document.getElementById('exportOptions');
    if (exportOptionsEl) {
        exportOptionsEl.style.display = 'block';
        const filenameInput = document.getElementById('exportFilename');
        if (filenameInput) {
            filenameInput.focus();
        }
    }
}

function hideExportOptions() {
    exportOptions.style.display = 'none';
    exportFilename.value = '';
}

function exportJSONWithName() {
    if (!parsedData) {
        alert('No JSON to export. Please format JSON first.');
        return;
    }
    
    const filenameInput = document.getElementById('exportFilename');
    let filename = filenameInput ? filenameInput.value.trim() : '';
    
    // If no filename provided, use default
    if (!filename) {
        filename = 'formatted-data';
    }
    
    // Remove .json extension if user added it
    if (filename.endsWith('.json')) {
        filename = filename.slice(0, -5);
    }
    
    // Sanitize filename - allow letters, numbers, spaces, hyphens, underscores
    filename = filename.replace(/[^a-z0-9\s_-]/gi, '_');
    
    try {
        const formatted = JSON.stringify(parsedData, null, 2);
        const blob = new Blob([formatted], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        // Show success feedback
        const exportBtn = document.getElementById('exportWithNameBtn');
        if (exportBtn) {
            const originalText = exportBtn.textContent;
            exportBtn.textContent = 'Exported!';
            setTimeout(() => {
                exportBtn.textContent = originalText;
                hideExportOptions();
            }, 1500);
        }
    } catch (error) {
        alert('Error exporting file: ' + error.message);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

let idCounter = 0;
function generateId() {
    return `json-${idCounter++}`;
}

// JSON Compare Functions
function autoFormatInput(inputElement) {
    const value = inputElement.value.trim();
    if (!value) return;
    
    try {
        const parsed = JSON.parse(value);
        // Custom formatter that keeps long strings on one line
        const formatted = JSON.stringify(parsed, (key, val) => {
            return val;
        }, 2);
        inputElement.value = formatted;
        inputElement.style.borderColor = '#48bb78';
        setTimeout(() => {
            inputElement.style.borderColor = '#cbd5e0';
        }, 500);
    } catch (error) {
        // Invalid JSON, show red border briefly
        inputElement.style.borderColor = '#e53e3e';
        setTimeout(() => {
            inputElement.style.borderColor = '#cbd5e0';
        }, 1000);
    }
}

function compareJSONs() {
    const input1 = json1Input.value.trim();
    const input2 = json2Input.value.trim();
    
    if (!input1 || !input2) {
        matchScore.innerHTML = '<div class="error-message">Please enter both JSONs</div>';
        differencesList.innerHTML = '';
        return;
    }
    
    try {
        const obj1 = JSON.parse(input1);
        const obj2 = JSON.parse(input2);
        
        const differences = findDifferences(obj1, obj2);
        const score = calculateMatchScore(obj1, obj2, differences);
        
        displayMatchScore(score);
        displayDifferences(differences);
    } catch (error) {
        matchScore.innerHTML = `<div class="error-message">Invalid JSON: ${error.message}</div>`;
        differencesList.innerHTML = '';
    }
}

function findDifferences(obj1, obj2, path = '') {
    const diffs = [];
    
    // Check if types are different
    if (typeof obj1 !== typeof obj2) {
        diffs.push({
            path: path || 'root',
            type: 'type_mismatch',
            value1: obj1,
            value2: obj2
        });
        return diffs;
    }
    
    // Handle null
    if (obj1 === null || obj2 === null) {
        if (obj1 !== obj2) {
            diffs.push({
                path: path || 'root',
                type: 'value_mismatch',
                value1: obj1,
                value2: obj2
            });
        }
        return diffs;
    }
    
    // Handle primitives
    if (typeof obj1 !== 'object') {
        if (obj1 !== obj2) {
            diffs.push({
                path: path || 'root',
                type: 'value_mismatch',
                value1: obj1,
                value2: obj2
            });
        }
        return diffs;
    }
    
    // Handle arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            diffs.push({
                path: path,
                type: 'array_length',
                value1: obj1.length,
                value2: obj2.length
            });
        }
        
        const maxLen = Math.max(obj1.length, obj2.length);
        for (let i = 0; i < maxLen; i++) {
            const newPath = `${path}[${i}]`;
            if (i >= obj1.length) {
                diffs.push({
                    path: newPath,
                    type: 'missing_in_json1',
                    value2: obj2[i]
                });
            } else if (i >= obj2.length) {
                diffs.push({
                    path: newPath,
                    type: 'missing_in_json2',
                    value1: obj1[i]
                });
            } else {
                diffs.push(...findDifferences(obj1[i], obj2[i], newPath));
            }
        }
        return diffs;
    }
    
    // Handle objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = new Set([...keys1, ...keys2]);
    
    allKeys.forEach(key => {
        const newPath = path ? `${path}.${key}` : key;
        
        if (!(key in obj1)) {
            diffs.push({
                path: newPath,
                type: 'missing_in_json1',
                value2: obj2[key]
            });
        } else if (!(key in obj2)) {
            diffs.push({
                path: newPath,
                type: 'missing_in_json2',
                value1: obj1[key]
            });
        } else {
            diffs.push(...findDifferences(obj1[key], obj2[key], newPath));
        }
    });
    
    return diffs;
}

function calculateMatchScore(obj1, obj2, differences) {
    const totalNodes = countNodes(obj1) + countNodes(obj2);
    const diffCount = differences.length;
    
    if (totalNodes === 0) return 100;
    
    const score = Math.max(0, Math.round(((totalNodes - diffCount * 2) / totalNodes) * 100));
    return score;
}

function countNodes(obj) {
    if (obj === null || typeof obj !== 'object') {
        return 1;
    }
    
    if (Array.isArray(obj)) {
        return obj.reduce((sum, item) => sum + countNodes(item), 1);
    }
    
    return Object.values(obj).reduce((sum, value) => sum + countNodes(value), 1);
}

function displayMatchScore(score) {
    let color = '#e53e3e';
    let status = 'Poor Match';
    
    if (score >= 90) {
        color = '#48bb78';
        status = 'Excellent Match';
    } else if (score >= 70) {
        color = '#ed8936';
        status = 'Good Match';
    } else if (score >= 50) {
        color = '#ecc94b';
        status = 'Fair Match';
    }
    
    matchScore.innerHTML = `
        <div class="score-display" style="border-color: ${color}">
            <div class="score-number" style="color: ${color}">${score}%</div>
            <div class="score-label">${status}</div>
        </div>
    `;
}

function displayDifferences(differences) {
    if (differences.length === 0) {
        differencesList.innerHTML = '<div class="no-differences">✓ JSONs are identical</div>';
        return;
    }
    
    let html = `<div class="diff-count">Found ${differences.length} difference(s)</div>`;
    
    differences.forEach((diff, index) => {
        html += `<div class="diff-item">`;
        html += `<div class="diff-header">`;
        html += `<span class="diff-number">#${index + 1}</span>`;
        html += `<span class="diff-path">${escapeHtml(diff.path)}</span>`;
        html += `<span class="diff-type ${diff.type}">${formatDiffType(diff.type)}</span>`;
        html += `</div>`;
        
        if (diff.type === 'missing_in_json1') {
            html += `<div class="diff-value added">+ JSON 2:</div>`;
            html += formatValueStructured(diff.value2, 'added');
        } else if (diff.type === 'missing_in_json2') {
            html += `<div class="diff-value removed">- JSON 1:</div>`;
            html += formatValueStructured(diff.value1, 'removed');
        } else if (diff.type === 'array_length') {
            html += `<div class="diff-value removed">JSON 1 length: ${diff.value1}</div>`;
            html += `<div class="diff-value added">JSON 2 length: ${diff.value2}</div>`;
        } else {
            html += `<div class="diff-value removed">- JSON 1:</div>`;
            html += formatValueStructured(diff.value1, 'removed');
            html += `<div class="diff-value added">+ JSON 2:</div>`;
            html += formatValueStructured(diff.value2, 'added');
        }
        
        html += `</div>`;
    });
    
    differencesList.innerHTML = html;
}

function formatDiffType(type) {
    const types = {
        'type_mismatch': 'Type Mismatch',
        'value_mismatch': 'Value Mismatch',
        'missing_in_json1': 'Missing in JSON 1',
        'missing_in_json2': 'Missing in JSON 2',
        'array_length': 'Array Length Mismatch'
    };
    return types[type] || type;
}

function formatValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
        return escapeHtml(JSON.stringify(value, null, 2));
    }
    if (typeof value === 'string') {
        return `"${escapeHtml(value)}"`;
    }
    return escapeHtml(String(value));
}

function formatValueStructured(value, className) {
    if (value === null) {
        return `<div class="diff-value ${className}"><span class="json-null">null</span></div>`;
    }
    if (value === undefined) {
        return `<div class="diff-value ${className}"><span class="json-null">undefined</span></div>`;
    }
    
    if (typeof value === 'string') {
        return `<div class="diff-value ${className}"><span class="json-string">"${escapeHtml(value)}"</span></div>`;
    }
    
    if (typeof value === 'number') {
        return `<div class="diff-value ${className}"><span class="json-number">${value}</span></div>`;
    }
    
    if (typeof value === 'boolean') {
        return `<div class="diff-value ${className}"><span class="json-boolean">${value}</span></div>`;
    }
    
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return `<div class="diff-value ${className}">[]</div>`;
        }
        
        let html = `<div class="diff-value ${className}">[</div>`;
        value.forEach((item, index) => {
            const isLast = index === value.length - 1;
            html += `<div class="diff-value ${className}" style="padding-left: 30px;">`;
            html += `<span class="json-key">[${index}]:</span> `;
            html += formatInlineValue(item);
            if (!isLast) html += ',';
            html += `</div>`;
        });
        html += `<div class="diff-value ${className}">]</div>`;
        return html;
    }
    
    if (typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.length === 0) {
            return `<div class="diff-value ${className}">{}</div>`;
        }
        
        let html = `<div class="diff-value ${className}">{</div>`;
        keys.forEach((key, index) => {
            const isLast = index === keys.length - 1;
            html += `<div class="diff-value ${className}" style="padding-left: 30px;">`;
            html += `<span class="json-key">"${escapeHtml(key)}":</span> `;
            html += formatInlineValue(value[key]);
            if (!isLast) html += ',';
            html += `</div>`;
        });
        html += `<div class="diff-value ${className}">}</div>`;
        return html;
    }
    
    return `<div class="diff-value ${className}">${escapeHtml(String(value))}</div>`;
}

function formatInlineValue(value) {
    if (value === null) return '<span class="json-null">null</span>';
    if (value === undefined) return '<span class="json-null">undefined</span>';
    if (typeof value === 'string') return `<span class="json-string">"${escapeHtml(value)}"</span>`;
    if (typeof value === 'number') return `<span class="json-number">${value}</span>`;
    if (typeof value === 'boolean') return `<span class="json-boolean">${value}</span>`;
    if (Array.isArray(value)) return `<span class="json-array">[${value.length} items]</span>`;
    if (typeof value === 'object') return `<span class="json-object">{${Object.keys(value).length} keys}</span>`;
    return escapeHtml(String(value));
}

function clearCompare() {
    json1Input.value = '';
    json2Input.value = '';
    matchScore.innerHTML = '';
    differencesList.innerHTML = '';
}

// Base64 Converter Functions
function encodeToBase64() {
    const text = textToEncode.value;
    const file = fileToEncode.files[0];
    
    if (!text && !file) {
        alert('Please enter text or select a file');
        return;
    }
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            let base64 = e.target.result;
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            const base64Index = base64.indexOf(',');
            if (base64Index !== -1) {
                base64 = base64.substring(base64Index + 1);
            }
            base64Output.value = base64;
        };
        reader.readAsDataURL(file);
    } else {
        const encoded = btoa(unescape(encodeURIComponent(text)));
        base64Output.value = encoded;
    }
}

function decodeBase64Text() {
    const base64 = base64ToDecodeText.value.trim();
    
    if (!base64) {
        alert('Please enter Base64 string');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(escape(atob(base64)));
        decodedTextOutput.value = decoded;
    } catch (error) {
        alert('Invalid Base64 string: ' + error.message);
    }
}

function decodeBase64File() {
    const base64 = base64ToDecodeFile.value.trim();
    
    if (!base64) {
        alert('Please enter Base64 string');
        return;
    }
    
    try {
        const { dataUrl, mimeType } = processBase64(base64);
        
        // Create download link
        const link = document.createElement('a');
        link.href = dataUrl;
        const ext = mimeType.split('/')[1] || 'bin';
        link.download = `decoded-file.${ext}`;
        link.click();
    } catch (error) {
        alert('Invalid Base64 string: ' + error.message);
    }
}

function previewBase64File() {
    const base64 = base64ToDecodeFile.value.trim();
    
    if (!base64) {
        alert('Please enter Base64 string');
        return;
    }
    
    try {
        const { dataUrl, mimeType } = processBase64(base64);
        
        // Show preview based on file type
        if (mimeType.startsWith('image/')) {
            previewArea.innerHTML = `
                <div class="preview-container">
                    <div class="preview-info">
                        <span class="preview-label">Type: ${mimeType}</span>
                    </div>
                    <img src="${dataUrl}" alt="Decoded Image" class="preview-image">
                </div>
            `;
        } else if (mimeType === 'application/pdf') {
            previewArea.innerHTML = `
                <div class="preview-container">
                    <div class="preview-info">
                        <span class="preview-label">Type: PDF Document</span>
                    </div>
                    <embed src="${dataUrl}" type="application/pdf" class="preview-pdf">
                </div>
            `;
        } else {
            previewArea.innerHTML = `
                <div class="preview-container">
                    <div class="preview-info">
                        <span class="preview-label">Type: ${mimeType}</span>
                        <span class="preview-message">Preview not available for this file type</span>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        previewArea.innerHTML = `<div class="preview-error">Invalid Base64 string: ${error.message}</div>`;
    }
}

function processBase64(base64) {
    base64 = (base64 || '').trim();
    // Check if it's a data URL or raw base64
    let dataUrl = base64;
    let mimeType = 'application/octet-stream';
    
    if (base64.startsWith('data:')) {
        // Extract mime type from data URL
        const mimeMatch = dataUrl.match(/data:([^;]+);base64,/);
        mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    } else {
        const compactBase64 = base64.replace(/\s/g, '');
        // Try to detect file type from base64 signature
        const signature = compactBase64.substring(0, 20);
        if (signature.startsWith('iVBORw0KGgo')) {
            mimeType = 'image/png';
            dataUrl = 'data:image/png;base64,' + compactBase64;
        } else if (signature.startsWith('/9j/')) {
            mimeType = 'image/jpeg';
            dataUrl = 'data:image/jpeg;base64,' + compactBase64;
        } else if (signature.startsWith('R0lGODlh') || signature.startsWith('R0lGODdh')) {
            mimeType = 'image/gif';
            dataUrl = 'data:image/gif;base64,' + compactBase64;
        } else if (signature.startsWith('UklGR')) {
            mimeType = 'image/webp';
            dataUrl = 'data:image/webp;base64,' + compactBase64;
        } else if (signature.startsWith('JVBERi0')) {
            mimeType = 'application/pdf';
            dataUrl = 'data:application/pdf;base64,' + compactBase64;
        } else {
            mimeType = 'application/octet-stream';
            dataUrl = 'data:application/octet-stream;base64,' + compactBase64;
        }
    }
    
    return { dataUrl, mimeType };
}

function copyToClipboardGeneric(element, button) {
    const text = element.value;
    if (!text) {
        alert('Nothing to copy');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button ? button.textContent : element.nextElementSibling?.textContent;
        const targetBtn = button || element.nextElementSibling;
        
        if (targetBtn) {
            targetBtn.textContent = 'Copied!';
            setTimeout(() => {
                targetBtn.textContent = originalText;
            }, 2000);
        }
    });
}

function resetEncode() {
    textToEncode.value = '';
    fileToEncode.value = '';
    encodeFileName.textContent = '';
    base64Output.value = '';
}

function resetDecode() {
    base64ToDecodeText.value = '';
    decodedTextOutput.value = '';
    base64ToDecodeFile.value = '';
    previewArea.innerHTML = '';
}

// Hash Generator Functions
function generateRequestId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    requestId.value = `REQ${timestamp}${random}`;
    updateHashStringPreview();
}

function updateHashStringPreview() {
    const cc = clientCode.value;
    const rid = requestId.value;
    const ak = apiKey.value;
    const s = salt.value;
    
    if (cc || rid || ak || s) {
        hashStringOutput.value = `${cc}|${rid}|${ak}|${s}`;
    } else {
        hashStringOutput.value = '';
    }
}

async function generateHashFromParams() {
    const hashString = hashStringOutput.value;
    
    if (!hashString || hashString === '|||') {
        alert('Please fill in at least one parameter');
        return;
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(hashString);
    
    // Generate both hashes
    const hash256 = await crypto.subtle.digest('SHA-256', data);
    sha256Output.value = arrayBufferToHex(hash256);
    
    const hash512 = await crypto.subtle.digest('SHA-512', data);
    sha512Output.value = arrayBufferToHex(hash512);
    
    // Auto-generate new requestId for next use
    generateRequestId();
}

async function generateHash(algorithm) {
    const text = textToHash.value;
    const file = fileToHash.files[0];
    
    if (!text && !file) {
        alert('Please enter text or select a file');
        return;
    }
    
    let data;
    if (file) {
        data = await file.arrayBuffer();
    } else {
        const encoder = new TextEncoder();
        data = encoder.encode(text);
    }
    
    if (algorithm === 'SHA-256' || algorithm === 'both') {
        const hash256 = await crypto.subtle.digest('SHA-256', data);
        sha256Output.value = arrayBufferToHex(hash256);
    }
    
    if (algorithm === 'SHA-512' || algorithm === 'both') {
        const hash512 = await crypto.subtle.digest('SHA-512', data);
        sha512Output.value = arrayBufferToHex(hash512);
    }
}

function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function resetHash() {
    textToHash.value = '';
    fileToHash.value = '';
    hashFileName.textContent = '';
    sha256Output.value = '';
    sha512Output.value = '';
    clientCode.value = '';
    apiKey.value = '';
    salt.value = '';
    hashStringOutput.value = '';
    generateRequestId();
}



// Image Editor Functions
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    imageFileName.textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            resetImage();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function drawImage() {
    if (!currentImage) return;
    
    const img = currentImage;
    canvas.width = img.width;
    canvas.height = img.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    
    ctx.restore();
}

function rotateImage(degrees) {
    if (!currentImage) return;
    rotation = (rotation + degrees) % 360;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (Math.abs(degrees) === 90) {
        tempCanvas.width = canvas.height;
        tempCanvas.height = canvas.width;
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate((degrees * Math.PI) / 180);
        tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    } else {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate((degrees * Math.PI) / 180);
        tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    }
    
    const newImg = new Image();
    newImg.onload = function() {
        currentImage = newImg;
        rotation = 0;
        drawImage();
    };
    newImg.src = tempCanvas.toDataURL();
}

function flipImageH() {
    if (!currentImage) return;
    flipHorizontal *= -1;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    tempCtx.translate(tempCanvas.width, 0);
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(canvas, 0, 0);
    
    const newImg = new Image();
    newImg.onload = function() {
        currentImage = newImg;
        flipHorizontal = 1;
        drawImage();
    };
    newImg.src = tempCanvas.toDataURL();
}

function flipImageV() {
    if (!currentImage) return;
    flipVertical *= -1;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    tempCtx.translate(0, tempCanvas.height);
    tempCtx.scale(1, -1);
    tempCtx.drawImage(canvas, 0, 0);
    
    const newImg = new Image();
    newImg.onload = function() {
        currentImage = newImg;
        flipVertical = 1;
        drawImage();
    };
    newImg.src = tempCanvas.toDataURL();
}

function invertColors() {
    if (!currentImage) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    
    ctx.putImageData(imageData, 0, 0);
    updateCurrentImage();
}

function applyGrayscale() {
    if (!currentImage) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
    
    ctx.putImageData(imageData, 0, 0);
    updateCurrentImage();
}

function adjustBrightness(amount) {
    if (!currentImage) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + amount));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + amount));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + amount));
    }
    
    ctx.putImageData(imageData, 0, 0);
    updateCurrentImage();
}

function enableCropMode() {
    if (!currentImage) return;
    cropMode = true;
    canvas.style.cursor = 'crosshair';
    document.getElementById('enableCrop').disabled = true;
    document.getElementById('applyCrop').disabled = false;
    document.getElementById('cancelCrop').disabled = false;
    
    // Save the current canvas state to avoid redrawing
    savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function startCrop(e) {
    if (!cropMode) return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    cropStart = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
    cropEnd = { ...cropStart };
}

function drawCropArea(e) {
    if (!cropMode || !cropStart || !isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    cropEnd = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
    
    // Restore saved image instead of redrawing
    if (savedImageData) {
        ctx.putImageData(savedImageData, 0, 0);
    }
    
    // Draw crop rectangle
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(
        cropStart.x,
        cropStart.y,
        cropEnd.x - cropStart.x,
        cropEnd.y - cropStart.y
    );
    
    // Draw semi-transparent overlay outside crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.setLineDash([]);
    
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);
    
    // Top
    ctx.fillRect(0, 0, canvas.width, y);
    // Bottom
    ctx.fillRect(0, y + height, canvas.width, canvas.height - y - height);
    // Left
    ctx.fillRect(0, y, x, height);
    // Right
    ctx.fillRect(x + width, y, canvas.width - x - width, height);
}

function endCrop() {
    if (!cropMode || !cropStart) return;
    isDrawing = false;
}

function applyCrop() {
    if (!cropStart || !cropEnd) return;
    
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);
    
    if (width < 10 || height < 10) {
        alert('Crop area too small');
        return;
    }
    
    // Get the clean image data (without overlay)
    const imageData = savedImageData ? 
        ctx.getImageData(x, y, width, height) : 
        ctx.getImageData(x, y, width, height);
    
    // First restore the clean image
    if (savedImageData) {
        ctx.putImageData(savedImageData, 0, 0);
    }
    
    // Get clean crop data
    const cleanImageData = ctx.getImageData(x, y, width, height);
    
    // Resize canvas and draw cropped area immediately
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(cleanImageData, 0, 0);
    
    // Update current image reference
    const newImg = new Image();
    newImg.onload = function() {
        currentImage = newImg;
        rotation = 0;
        flipHorizontal = 1;
        flipVertical = 1;
    };
    newImg.src = canvas.toDataURL();
    
    // Reset crop state
    cropMode = false;
    cropStart = null;
    cropEnd = null;
    isDrawing = false;
    savedImageData = null;
    canvas.style.cursor = 'default';
    document.getElementById('enableCrop').disabled = false;
    document.getElementById('applyCrop').disabled = true;
    document.getElementById('cancelCrop').disabled = true;
}

function cancelCrop() {
    cropMode = false;
    cropStart = null;
    cropEnd = null;
    isDrawing = false;
    savedImageData = null;
    canvas.style.cursor = 'default';
    document.getElementById('enableCrop').disabled = false;
    document.getElementById('applyCrop').disabled = true;
    document.getElementById('cancelCrop').disabled = true;
    drawImage();
}

function updateCurrentImage() {
    const newImg = new Image();
    newImg.onload = function() {
        currentImage = newImg;
    };
    newImg.src = canvas.toDataURL();
}

function resetImage() {
    if (!originalImage) return;
    currentImage = originalImage;
    rotation = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    cropMode = false;
    cropStart = null;
    cropEnd = null;
    isDrawing = false;
    savedImageData = null;
    canvas.style.cursor = 'default';
    document.getElementById('enableCrop').disabled = false;
    document.getElementById('applyCrop').disabled = true;
    document.getElementById('cancelCrop').disabled = true;
    drawImage();
}

function downloadImage() {
    if (!currentImage) return;
    
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
}

}); // End of DOMContentLoaded

// Text Summary Functions
function analyzeText() {
    const text = textAnalysisInput.value;
    
    // Total characters
    document.getElementById('totalChars').textContent = text.length;
    
    // Characters without spaces
    const noSpaces = text.replace(/\s/g, '');
    document.getElementById('charsNoSpaces').textContent = noSpaces.length;
    
    // Word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    document.getElementById('wordCount').textContent = words.length;
    
    // Sentence count
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    document.getElementById('sentenceCount').textContent = sentences.length;
    
    // Paragraph count
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    document.getElementById('paragraphCount').textContent = paragraphs.length;
    
    // Line count
    const lines = text.split(/\n/).filter(l => l.trim().length > 0);
    document.getElementById('lineCount').textContent = lines.length;
    
    // Alphabet count
    const alphabets = text.match(/[a-zA-Z]/g);
    document.getElementById('alphabetCount').textContent = alphabets ? alphabets.length : 0;
    
    // Number count
    const numbers = text.match(/[0-9]/g);
    document.getElementById('numberCount').textContent = numbers ? numbers.length : 0;
    
    // Space count
    const spaces = text.match(/\s/g);
    document.getElementById('spaceCount').textContent = spaces ? spaces.length : 0;
    
    // Special character count
    const specialChars = text.match(/[^a-zA-Z0-9\s]/g);
    document.getElementById('specialCharCount').textContent = specialChars ? specialChars.length : 0;
    
    // Letter frequency
    displayLetterFrequency(text);
}

function displayLetterFrequency(text) {
    const letterCount = {};
    const letters = text.toLowerCase().match(/[a-z]/g);
    
    if (!letters || letters.length === 0) {
        document.getElementById('letterFrequencyChart').innerHTML = '<p class="no-data">No letters to analyze</p>';
        return;
    }
    
    // Count each letter
    letters.forEach(letter => {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    });
    
    // Sort by frequency (descending)
    const sortedLetters = Object.entries(letterCount).sort((a, b) => b[1] - a[1]);
    
    // Create visual chart
    let html = '<div class="frequency-bars">';
    const maxCount = sortedLetters[0][1];
    
    sortedLetters.forEach(([letter, count]) => {
        const percentage = (count / maxCount) * 100;
        html += `
            <div class="frequency-item">
                <div class="frequency-letter">${letter.toUpperCase()}</div>
                <div class="frequency-bar-container">
                    <div class="frequency-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="frequency-count">${count}</div>
            </div>
        `;
    });
    
    html += '</div>';
    document.getElementById('letterFrequencyChart').innerHTML = html;
}

function resetTextAnalysis() {
    textAnalysisInput.value = '';
    document.getElementById('totalChars').textContent = '0';
    document.getElementById('charsNoSpaces').textContent = '0';
    document.getElementById('wordCount').textContent = '0';
    document.getElementById('sentenceCount').textContent = '0';
    document.getElementById('paragraphCount').textContent = '0';
    document.getElementById('lineCount').textContent = '0';
    document.getElementById('alphabetCount').textContent = '0';
    document.getElementById('numberCount').textContent = '0';
    document.getElementById('spaceCount').textContent = '0';
    document.getElementById('specialCharCount').textContent = '0';
    document.getElementById('letterFrequencyChart').innerHTML = '';
}

// Additional Utility Tool Functions
function getElementTextValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

function setElementTextValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value;
}

function setElementTextContent(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function copyElementText(id) {
    const element = document.getElementById(id);
    if (!element) return;

    const text = 'value' in element ? element.value : element.textContent;
    if (!text) {
        alert('Nothing to copy');
        return;
    }

    navigator.clipboard.writeText(text).catch(() => {
        alert('Unable to copy. Please try again.');
    });
}

function base64UrlDecode(input) {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function decodeJWT() {
    const token = getElementTextValue('jwtInput').trim();
    const parts = token.split('.');

    if (parts.length < 2) {
        setElementTextContent('jwtStatusOutput', 'Invalid JWT structure');
        return;
    }

    try {
        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));
        setElementTextContent('jwtHeaderOutput', JSON.stringify(header, null, 2));
        setElementTextContent('jwtPayloadOutput', JSON.stringify(payload, null, 2));

        const status = [];
        if (payload.iat) status.push(`Issued: ${new Date(payload.iat * 1000).toLocaleString()}`);
        if (payload.exp) {
            const expires = new Date(payload.exp * 1000);
            status.push(`Expires: ${expires.toLocaleString()}`);
            status.push(expires < new Date() ? 'Status: expired' : 'Status: active');
        }
        setElementTextContent('jwtStatusOutput', status.join('\n'));
    } catch (error) {
        setElementTextContent('jwtStatusOutput', `Unable to decode JWT: ${error.message}`);
    }
}

function clearJWT() {
    setElementTextValue('jwtInput', '');
    setElementTextContent('jwtHeaderOutput', '');
    setElementTextContent('jwtPayloadOutput', '');
    setElementTextContent('jwtStatusOutput', '');
}

function transformURL(mode) {
    const input = getElementTextValue('urlInput');
    try {
        const output = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
        setElementTextValue('urlOutput', output);
    } catch (error) {
        setElementTextValue('urlOutput', `Invalid URL encoding: ${error.message}`);
    }
}

function clearURLTool() {
    setElementTextValue('urlInput', '');
    setElementTextValue('urlOutput', '');
}

function describeDate(date) {
    return [
        `Local: ${date.toLocaleString()}`,
        `UTC: ${date.toISOString()}`,
        `Unix seconds: ${Math.floor(date.getTime() / 1000)}`,
        `Unix milliseconds: ${date.getTime()}`
    ].join('\n');
}

function setTimestampNow() {
    const now = new Date();
    setElementTextValue('timestampInput', String(Math.floor(now.getTime() / 1000)));
    setElementTextValue('dateTimeInput', toDateTimeLocalValue(now));
    setElementTextContent('timestampOutput', describeDate(now));
}

function timestampToDate() {
    const raw = getElementTextValue('timestampInput').trim();
    const value = Number(raw);
    if (!Number.isFinite(value)) {
        setElementTextContent('timestampOutput', 'Enter a valid numeric timestamp');
        return;
    }

    const ms = Math.abs(value) < 100000000000 ? value * 1000 : value;
    const date = new Date(ms);
    setElementTextValue('dateTimeInput', toDateTimeLocalValue(date));
    setElementTextContent('timestampOutput', describeDate(date));
}

function dateToTimestamp() {
    const raw = getElementTextValue('dateTimeInput');
    if (!raw) {
        setElementTextContent('timestampOutput', 'Select a date and time');
        return;
    }

    const date = new Date(raw);
    setElementTextValue('timestampInput', String(Math.floor(date.getTime() / 1000)));
    setElementTextContent('timestampOutput', describeDate(date));
}

function toDateTimeLocalValue(date) {
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function clearTimestampTool() {
    setElementTextValue('timestampInput', '');
    setElementTextValue('dateTimeInput', '');
    setElementTextContent('timestampOutput', '');
}

function generateUUIDs() {
    const countInput = document.getElementById('uuidCount');
    const count = Math.min(100, Math.max(1, Number(countInput.value) || 1));
    countInput.value = count;

    const ids = Array.from({ length: count }, () => {
        if (crypto.randomUUID) return crypto.randomUUID();
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    });
    setElementTextValue('uuidOutput', ids.join('\n'));
}

function clearUUIDTool() {
    setElementTextValue('uuidOutput', '');
    const countInput = document.getElementById('uuidCount');
    if (countInput) countInput.value = 5;
}

function generateQRCode() {
    const input = getElementTextValue('qrInput');
    const status = document.getElementById('qrStatus');
    const canvas = document.getElementById('qrCanvas');
    const sizeInput = document.getElementById('qrSize');
    const size = Math.min(640, Math.max(160, Number(sizeInput.value) || 280));
    sizeInput.value = size;

    if (!input) {
        if (status) status.textContent = 'Enter text or a URL';
        return;
    }

    try {
        const matrix = createQRCodeMatrix(input);
        drawQRMatrix(canvas, matrix, size);
        if (status) status.textContent = `${matrix.length} x ${matrix.length} modules`;
    } catch (error) {
        if (status) status.textContent = error.message;
    }
}

function downloadQRCode() {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearQRCode() {
    setElementTextValue('qrInput', '');
    setElementTextContent('qrStatus', '');
    const canvas = document.getElementById('qrCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function createQRCodeMatrix(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    const versions = [
        { version: 1, dataCodewords: 19, eccCodewords: 7, maxBytes: 17, alignment: [] },
        { version: 2, dataCodewords: 34, eccCodewords: 10, maxBytes: 32, alignment: [18] },
        { version: 3, dataCodewords: 55, eccCodewords: 15, maxBytes: 53, alignment: [22] },
        { version: 4, dataCodewords: 80, eccCodewords: 20, maxBytes: 78, alignment: [26] }
    ];
    const config = versions.find(item => bytes.length <= item.maxBytes);
    if (!config) throw new Error('QR input is too long. Use 78 bytes or fewer.');

    const dataCodewords = makeQRDataCodewords(bytes, config);
    const ecc = reedSolomonCompute(dataCodewords, config.eccCodewords);
    const codewords = dataCodewords.concat(ecc);
    return makeQRMatrix(codewords, config);
}

function makeQRDataCodewords(bytes, config) {
    const bits = [];
    appendBits(bits, 0b0100, 4);
    appendBits(bits, bytes.length, 8);
    bytes.forEach(byte => appendBits(bits, byte, 8));

    const capacityBits = config.dataCodewords * 8;
    appendBits(bits, 0, Math.min(4, capacityBits - bits.length));
    while (bits.length % 8 !== 0) bits.push(0);

    const data = [];
    for (let i = 0; i < bits.length; i += 8) {
        data.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0));
    }
    for (let pad = 0; data.length < config.dataCodewords; pad++) {
        data.push(pad % 2 === 0 ? 0xec : 0x11);
    }
    return data;
}

function appendBits(bits, value, length) {
    for (let i = length - 1; i >= 0; i--) {
        bits.push((value >>> i) & 1);
    }
}

function makeQRMatrix(codewords, config) {
    const size = 21 + (config.version - 1) * 4;
    const modules = Array.from({ length: size }, () => Array(size).fill(false));
    const reserved = Array.from({ length: size }, () => Array(size).fill(false));
    const set = (x, y, value, reserve = true) => {
        if (x < 0 || y < 0 || x >= size || y >= size) return;
        modules[y][x] = Boolean(value);
        if (reserve) reserved[y][x] = true;
    };

    drawFinder(set, 0, 0);
    drawFinder(set, size - 7, 0);
    drawFinder(set, 0, size - 7);
    drawTiming(set, size);
    config.alignment.forEach(center => drawAlignment(set, center, center));
    reserveFormatAreas(reserved, size);
    set(8, size - 8, true);

    const bits = codewords.flatMap(codeword => {
        const codewordBits = [];
        appendBits(codewordBits, codeword, 8);
        return codewordBits;
    });

    let bitIndex = 0;
    let upward = true;
    for (let right = size - 1; right >= 1; right -= 2) {
        if (right === 6) right--;
        for (let vert = 0; vert < size; vert++) {
            const y = upward ? size - 1 - vert : vert;
            for (let dx = 0; dx < 2; dx++) {
                const x = right - dx;
                if (reserved[y][x]) continue;
                const bit = bitIndex < bits.length ? bits[bitIndex++] : 0;
                const masked = bit ^ (((x + y) % 2) === 0 ? 1 : 0);
                set(x, y, masked, false);
            }
        }
        upward = !upward;
    }

    drawFormatBits(set, size, 0);
    return modules;
}

function drawFinder(set, x, y) {
    for (let dy = -1; dy <= 7; dy++) {
        for (let dx = -1; dx <= 7; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            const inPattern = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
            const black = inPattern && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
            set(xx, yy, black);
        }
    }
}

function drawTiming(set, size) {
    for (let i = 8; i < size - 8; i++) {
        set(i, 6, i % 2 === 0);
        set(6, i, i % 2 === 0);
    }
}

function drawAlignment(set, cx, cy) {
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
            const distance = Math.max(Math.abs(dx), Math.abs(dy));
            set(cx + dx, cy + dy, distance !== 1);
        }
    }
}

function reserveFormatAreas(reserved, size) {
    const reserve = (x, y) => {
        if (x >= 0 && y >= 0 && x < size && y < size) reserved[y][x] = true;
    };

    for (let i = 0; i <= 5; i++) reserve(8, i);
    reserve(8, 7);
    reserve(8, 8);
    reserve(7, 8);
    for (let i = 9; i < 15; i++) reserve(14 - i, 8);
    for (let i = 0; i < 8; i++) reserve(size - 1 - i, 8);
    for (let i = 8; i < 15; i++) reserve(8, size - 15 + i);
}

function drawFormatBits(set, size, mask) {
    const bits = getFormatBits(mask);
    const bitAt = i => ((bits >>> i) & 1) === 1;

    for (let i = 0; i <= 5; i++) set(8, i, bitAt(i));
    set(8, 7, bitAt(6));
    set(8, 8, bitAt(7));
    set(7, 8, bitAt(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bitAt(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bitAt(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bitAt(i));
    set(8, size - 8, true);
}

function getFormatBits(mask) {
    let data = (1 << 3) | mask; // Error correction level L.
    let bits = data << 10;
    const generator = 0x537;
    for (let i = 14; i >= 10; i--) {
        if (((bits >>> i) & 1) !== 0) bits ^= generator << (i - 10);
    }
    return ((data << 10) | bits) ^ 0x5412;
}

function reedSolomonCompute(data, degree) {
    const generator = reedSolomonGenerator(degree);
    const result = Array(degree).fill(0);
    data.forEach(byte => {
        const factor = byte ^ result.shift();
        result.push(0);
        generator.forEach((coef, index) => {
            result[index] ^= gfMultiply(coef, factor);
        });
    });
    return result;
}

function reedSolomonGenerator(degree) {
    let result = [1];
    for (let i = 0; i < degree; i++) {
        const next = Array(result.length + 1).fill(0);
        result.forEach((coef, index) => {
            next[index] ^= gfMultiply(coef, 1);
            next[index + 1] ^= gfMultiply(coef, gfPow(2, i));
        });
        result = next;
    }
    return result.slice(1);
}

function gfMultiply(x, y) {
    let result = 0;
    while (y !== 0) {
        if (y & 1) result ^= x;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
        y >>>= 1;
    }
    return result;
}

function gfPow(x, power) {
    let result = 1;
    for (let i = 0; i < power; i++) result = gfMultiply(result, x);
    return result;
}

function drawQRMatrix(canvas, matrix, size) {
    const quietZone = 4;
    const modules = matrix.length + quietZone * 2;
    const scale = Math.floor(size / modules);
    const canvasSize = scale * modules;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = '#111827';

    matrix.forEach((row, y) => {
        row.forEach((dark, x) => {
            if (dark) {
                ctx.fillRect((x + quietZone) * scale, (y + quietZone) * scale, scale, scale);
            }
        });
    });
}

function parseYamlScalar(value) {
    const trimmed = value.trim();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null' || trimmed === '~') return null;
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
    }
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        return trimmed.slice(1, -1).split(',').map(item => parseYamlScalar(item));
    }
    return trimmed;
}

function parseSimpleYAML(input) {
    const root = {};
    const stack = [{ indent: -1, value: root }];
    const lines = input.split(/\r?\n/).filter(line => line.trim() && !line.trim().startsWith('#'));

    lines.forEach(line => {
        const indent = line.match(/^\s*/)[0].length;
        const trimmed = line.trim();
        const match = trimmed.match(/^([^:]+):(.*)$/);
        if (!match) throw new Error(`Unsupported YAML line: ${trimmed}`);

        while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
        const parent = stack[stack.length - 1].value;
        const key = match[1].trim();
        const rawValue = match[2].trim();

        if (!rawValue) {
            parent[key] = {};
            stack.push({ indent, value: parent[key] });
        } else {
            parent[key] = parseYamlScalar(rawValue);
        }
    });

    return root;
}

function yamlToJSON() {
    try {
        const parsed = parseSimpleYAML(getElementTextValue('yamlJsonInput'));
        setElementTextValue('yamlJsonOutput', JSON.stringify(parsed, null, 2));
    } catch (error) {
        setElementTextValue('yamlJsonOutput', `YAML parse error: ${error.message}`);
    }
}

function jsonToYAML() {
    try {
        const parsed = JSON.parse(getElementTextValue('yamlJsonInput'));
        setElementTextValue('yamlJsonOutput', objectToYAML(parsed));
    } catch (error) {
        setElementTextValue('yamlJsonOutput', `JSON parse error: ${error.message}`);
    }
}

function objectToYAML(value, indent = 0) {
    const pad = '  '.repeat(indent);
    if (Array.isArray(value)) {
        return value.map(item => `${pad}- ${typeof item === 'object' && item !== null ? `\n${objectToYAML(item, indent + 1)}` : formatYamlScalar(item)}`).join('\n');
    }
    if (value && typeof value === 'object') {
        return Object.entries(value).map(([key, item]) => {
            if (item && typeof item === 'object') {
                return `${pad}${key}:\n${objectToYAML(item, indent + 1)}`;
            }
            return `${pad}${key}: ${formatYamlScalar(item)}`;
        }).join('\n');
    }
    return `${pad}${formatYamlScalar(value)}`;
}

function formatYamlScalar(value) {
    if (value === null) return 'null';
    if (typeof value === 'string') {
        return /[:#\n]/.test(value) ? JSON.stringify(value) : value;
    }
    return String(value);
}

function clearYamlJsonTool() {
    setElementTextValue('yamlJsonInput', '');
    setElementTextValue('yamlJsonOutput', '');
}

function parseCSV(input, delimiter = ',') {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const next = input[i + 1];

        if (char === '"' && quoted && next === '"') {
            field += '"';
            i++;
        } else if (char === '"') {
            quoted = !quoted;
        } else if (char === delimiter && !quoted) {
            row.push(field);
            field = '';
        } else if ((char === '\n' || char === '\r') && !quoted) {
            if (char === '\r' && next === '\n') i++;
            row.push(field);
            rows.push(row);
            row = [];
            field = '';
        } else {
            field += char;
        }
    }

    row.push(field);
    if (row.length > 1 || row[0] !== '') rows.push(row);
    return rows;
}

function csvToJSON() {
    try {
        const delimiter = getElementTextValue('csvDelimiter') || ',';
        const rows = parseCSV(getElementTextValue('csvJsonInput'), delimiter);
        if (rows.length === 0) throw new Error('CSV has no rows');
        const headers = rows[0].map(header => header.trim());
        const data = rows.slice(1).map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])));
        setElementTextValue('csvJsonOutput', JSON.stringify(data, null, 2));
    } catch (error) {
        setElementTextValue('csvJsonOutput', `CSV parse error: ${error.message}`);
    }
}

function jsonToCSV() {
    try {
        const delimiter = getElementTextValue('csvDelimiter') || ',';
        const data = JSON.parse(getElementTextValue('csvJsonInput'));
        const rows = Array.isArray(data) ? data : [data];
        const headers = Array.from(rows.reduce((set, row) => {
            Object.keys(row || {}).forEach(key => set.add(key));
            return set;
        }, new Set()));
        const csvRows = [headers, ...rows.map(row => headers.map(header => row ? row[header] : ''))];
        setElementTextValue('csvJsonOutput', csvRows.map(row => row.map(value => escapeCSVValue(value, delimiter)).join(delimiter)).join('\n'));
    } catch (error) {
        setElementTextValue('csvJsonOutput', `JSON parse error: ${error.message}`);
    }
}

function escapeCSVValue(value, delimiter) {
    const text = value == null ? '' : String(value);
    return text.includes('"') || text.includes('\n') || text.includes(delimiter)
        ? `"${text.replace(/"/g, '""')}"`
        : text;
}

function clearCsvJsonTool() {
    setElementTextValue('csvJsonInput', '');
    setElementTextValue('csvJsonOutput', '');
    setElementTextValue('csvDelimiter', ',');
}

function formatXMLTool() {
    const input = getElementTextValue('xmlInput').trim();
    try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(input, 'application/xml');
        if (xml.querySelector('parsererror')) throw new Error('Invalid XML');
        const formatted = input.replace(/>\s*</g, '><').replace(/></g, '>\n<');
        let indent = 0;
        const output = formatted.split('\n').map(line => {
            if (/^<\/.+>/.test(line)) indent = Math.max(indent - 1, 0);
            const padded = `${'  '.repeat(indent)}${line}`;
            if (/^<[^!?/][^>]*[^/]>.*/.test(line) && !line.includes(`</`)) indent++;
            return padded;
        }).join('\n');
        setElementTextValue('xmlOutput', output);
    } catch (error) {
        setElementTextValue('xmlOutput', `XML error: ${error.message}`);
    }
}

function minifyXMLTool() {
    setElementTextValue('xmlOutput', getElementTextValue('xmlInput').replace(/>\s+</g, '><').trim());
}

function clearXMLTool() {
    setElementTextValue('xmlInput', '');
    setElementTextValue('xmlOutput', '');
}

function runRegexTester() {
    const pattern = getElementTextValue('regexPattern');
    const flags = Array.from(new Set((getElementTextValue('regexFlags') || 'g').split(''))).join('');
    const text = getElementTextValue('regexText');

    try {
        const regex = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                match: match[0],
                index: match.index,
                groups: match.slice(1)
            });
            if (match[0] === '') regex.lastIndex++;
        }
        setElementTextContent('regexOutput', JSON.stringify({ count: matches.length, matches }, null, 2));
    } catch (error) {
        setElementTextContent('regexOutput', `Regex error: ${error.message}`);
    }
}

function clearRegexTool() {
    setElementTextValue('regexPattern', '');
    setElementTextValue('regexFlags', 'g');
    setElementTextValue('regexText', '');
    setElementTextContent('regexOutput', '');
}


// File Analyzer Functions
function handleFileAnalyzer() {
    const file = fileAnalyzerInput.files[0];
    if (!file) return;
    
    currentFile = file;
    currentFileType = file.type;
    
    // Display file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileType').textContent = getFileExtension(file.name).toUpperCase();
    document.getElementById('mimeType').textContent = file.type || 'Unknown';
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('lastModified').textContent = new Date(file.lastModified).toLocaleString();
    
    document.getElementById('fileInfoDisplay').style.display = 'block';
    
    // Show preview
    showFilePreview(file);
    
    // Show converter options
    showConverterOptions(file);
}

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showFilePreview(file) {
    const previewArea = document.getElementById('filePreviewArea');
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewArea.innerHTML = `
                <h4>Preview</h4>
                <img src="${e.target.result}" alt="Preview" style="max-width: 100%; border-radius: 8px; border: 2px solid #e2e8f0;">
            `;
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewArea.innerHTML = `
                <h4>Preview</h4>
                <embed src="${e.target.result}" type="application/pdf" style="width: 100%; height: 400px; border-radius: 8px; border: 2px solid #e2e8f0;">
            `;
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewArea.innerHTML = `
                <h4>Preview</h4>
                <pre style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 2px solid #e2e8f0; max-height: 300px; overflow: auto;">${escapeHtml(e.target.result.substring(0, 1000))}</pre>
            `;
        };
        reader.readAsText(file);
    } else {
        previewArea.innerHTML = `
            <h4>Preview</h4>
            <p style="color: #718096; font-style: italic;">Preview not available for this file type</p>
        `;
    }
}

function showConverterOptions(file) {
    const converterOptions = document.getElementById('converterOptions');
    const pdfSection = document.getElementById('pdfConversionSection');
    const imageConversions = document.getElementById('imageConversions');
    
    converterOptions.style.display = 'block';
    
    if (file.type.startsWith('image/')) {
        imageConversions.style.display = 'flex';
        pdfSection.style.display = 'none';
    } else if (file.type === 'application/pdf') {
        imageConversions.style.display = 'none';
        pdfSection.style.display = 'block';
    } else {
        converterOptions.style.display = 'none';
    }
}

async function convertFile(format) {
    if (!currentFile) {
        alert('Please upload a file first');
        return;
    }
    
    const quality = parseFloat(document.getElementById('qualitySlider').value);
    
    if (format === 'pdf-to-png' || format === 'pdf-to-jpeg') {
        alert('PDF to image conversion requires a PDF rendering library. This is a browser limitation. Please use online tools or desktop software for PDF conversion.');
        return;
    }
    
    if (currentFile.type.startsWith('image/')) {
        // Check WebP support
        if (format === 'webp' && !isWebPSupported()) {
            alert('WebP format is not supported in your browser. Please try PNG or JPEG format.');
            return;
        }
        convertImage(currentFile, format, quality);
    }
}

function isWebPSupported() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        // Check if toDataURL supports webp
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

function convertImage(file, targetFormat, quality) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    alert('Canvas not supported in your browser');
                    return;
                }
                
                ctx.drawImage(img, 0, 0);
                
                let mimeType = 'image/png';
                let extension = 'png';
                
                if (targetFormat === 'jpeg') {
                    mimeType = 'image/jpeg';
                    extension = 'jpg';
                } else if (targetFormat === 'webp') {
                    mimeType = 'image/webp';
                    extension = 'webp';
                }
                
                // Check if toBlob is supported
                if (!canvas.toBlob) {
                    // Fallback for older browsers
                    const dataUrl = canvas.toDataURL(mimeType, quality);
                    downloadFromDataUrl(dataUrl, file.name, extension, targetFormat);
                    return;
                }
                
                canvas.toBlob((blob) => {
                    if (!blob) {
                        alert('Failed to convert image. Your browser may not support this format.');
                        return;
                    }
                    
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    link.download = `${originalName}_converted.${extension}`;
                    link.href = url;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    
                    setTimeout(() => {
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    }, 100);
                    
                    alert(`File converted to ${targetFormat.toUpperCase()} successfully!`);
                }, mimeType, quality);
            } catch (error) {
                console.error('Conversion error:', error);
                alert('Error converting image: ' + error.message);
            }
        };
        
        img.onerror = () => {
            alert('Failed to load image. Please try a different file.');
        };
        
        img.src = e.target.result;
    };
    
    reader.onerror = () => {
        alert('Failed to read file. Please try again.');
    };
    
    reader.readAsDataURL(file);
}

function downloadFromDataUrl(dataUrl, originalName, extension, format) {
    const link = document.createElement('a');
    const name = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    link.download = `${name}_converted.${extension}`;
    link.href = dataUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
    
    alert(`File converted to ${format.toUpperCase()} successfully!`);
}

function resetFileAnalyzer() {
    fileAnalyzerInput.value = '';
    currentFile = null;
    currentFileType = null;
    document.getElementById('fileInfoDisplay').style.display = 'none';
    document.getElementById('converterOptions').style.display = 'none';
    document.getElementById('filePreviewArea').innerHTML = '';
    qualitySlider.value = 0.9;
    qualityValue.textContent = '90%';
}


// Text Compare Functions
function updateTextStats(textarea, prefix) {
    const text = textarea.value;
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const lines = text.split('\n').length;
    
    const charsEl = document.getElementById(`${prefix}Chars`);
    const wordsEl = document.getElementById(`${prefix}Words`);
    const linesEl = document.getElementById(`${prefix}Lines`);
    
    if (charsEl) charsEl.textContent = chars;
    if (wordsEl) wordsEl.textContent = words;
    if (linesEl) linesEl.textContent = lines;
}

function compareTexts() {
    console.log('compareTexts function called');
    
    const text1Input = document.getElementById('text1Input');
    const text2Input = document.getElementById('text2Input');
    
    if (!text1Input || !text2Input) {
        console.error('Text input elements not found');
        alert('Error: Text input fields not found');
        return;
    }
    
    const text1 = text1Input.value;
    const text2 = text2Input.value;
    
    console.log('Text 1 length:', text1.length);
    console.log('Text 2 length:', text2.length);
    
    if (!text1 && !text2) {
        alert('Please enter text in both fields');
        return;
    }
    
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    console.log('Lines 1:', lines1.length);
    console.log('Lines 2:', lines2.length);
    
    const diff = computeDiff(lines1, lines2);
    console.log('Diff computed:', diff.length, 'items');
    
    displayDiff(diff);
    displaySummary(diff);
}

function computeDiff(lines1, lines2) {
    const diff = [];
    let i = 0, j = 0;
    
    while (i < lines1.length || j < lines2.length) {
        if (i >= lines1.length) {
            // Remaining lines in text2 are additions
            diff.push({ type: 'added', line: lines2[j], lineNum2: j + 1 });
            j++;
        } else if (j >= lines2.length) {
            // Remaining lines in text1 are deletions
            diff.push({ type: 'removed', line: lines1[i], lineNum1: i + 1 });
            i++;
        } else if (lines1[i] === lines2[j]) {
            // Lines are the same
            diff.push({ type: 'unchanged', line: lines1[i], lineNum1: i + 1, lineNum2: j + 1 });
            i++;
            j++;
        } else {
            // Lines are different - check if it's a modification or add/remove
            const foundInText2 = lines2.indexOf(lines1[i], j);
            const foundInText1 = lines1.indexOf(lines2[j], i);
            
            if (foundInText2 !== -1 && (foundInText1 === -1 || foundInText2 - j < foundInText1 - i)) {
                // Line from text1 found later in text2, so lines in between are additions
                diff.push({ type: 'added', line: lines2[j], lineNum2: j + 1 });
                j++;
            } else if (foundInText1 !== -1) {
                // Line from text2 found later in text1, so lines in between are deletions
                diff.push({ type: 'removed', line: lines1[i], lineNum1: i + 1 });
                i++;
            } else {
                // Lines are modified
                diff.push({ type: 'removed', line: lines1[i], lineNum1: i + 1 });
                diff.push({ type: 'added', line: lines2[j], lineNum2: j + 1 });
                i++;
                j++;
            }
        }
    }
    
    return diff;
}

function displayDiff(diff) {
    const diffOutput = document.getElementById('diffOutput');
    
    if (!diffOutput) {
        console.error('diffOutput element not found');
        return;
    }
    
    if (diff.length === 0) {
        diffOutput.innerHTML = '<div class="no-differences">Texts are identical</div>';
        return;
    }
    
    // Local escape function to avoid dependency issues
    const escape = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    let html = '<div class="diff-lines">';
    
    diff.forEach(item => {
        const lineNum = item.lineNum1 || item.lineNum2 || '';
        const escapedLine = escape(item.line || '(empty line)');
        
        if (item.type === 'removed') {
            html += `<div class="diff-line removed">
                <span class="line-number">${item.lineNum1}</span>
                <span class="line-marker">-</span>
                <span class="line-content">${escapedLine}</span>
            </div>`;
        } else if (item.type === 'added') {
            html += `<div class="diff-line added">
                <span class="line-number">${item.lineNum2}</span>
                <span class="line-marker">+</span>
                <span class="line-content">${escapedLine}</span>
            </div>`;
        } else {
            html += `<div class="diff-line unchanged">
                <span class="line-number">${item.lineNum1}</span>
                <span class="line-marker">&nbsp;</span>
                <span class="line-content">${escapedLine}</span>
            </div>`;
        }
    });
    
    html += '</div>';
    diffOutput.innerHTML = html;
    console.log('Diff displayed successfully');
}

function displaySummary(diff) {
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const unchanged = diff.filter(d => d.type === 'unchanged').length;
    const total = diff.length;
    
    const similarity = total > 0 ? Math.round((unchanged / total) * 100) : 0;
    
    const similarityEl = document.getElementById('similarityScore');
    const addedEl = document.getElementById('addedCount');
    const removedEl = document.getElementById('removedCount');
    const unchangedEl = document.getElementById('unchangedCount');
    
    if (similarityEl) {
        similarityEl.textContent = similarity + '%';
        
        // Color code similarity
        if (similarity >= 80) {
            similarityEl.style.color = '#48bb78';
        } else if (similarity >= 50) {
            similarityEl.style.color = '#ed8936';
        } else {
            similarityEl.style.color = '#e53e3e';
        }
    }
    
    if (addedEl) addedEl.textContent = added;
    if (removedEl) removedEl.textContent = removed;
    if (unchangedEl) unchangedEl.textContent = unchanged;
    
    console.log('Summary displayed - Similarity:', similarity + '%');
}

function clearTextCompare() {
    const text1Input = document.getElementById('text1Input');
    const text2Input = document.getElementById('text2Input');
    
    if (text1Input) text1Input.value = '';
    if (text2Input) text2Input.value = '';
    
    const elements = [
        'text1Chars', 'text1Words', 'text1Lines',
        'text2Chars', 'text2Words', 'text2Lines',
        'similarityScore', 'addedCount', 'removedCount', 'unchangedCount'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = id === 'similarityScore' ? '0%' : '0';
    });
    
    const diffOutput = document.getElementById('diffOutput');
    if (diffOutput) diffOutput.innerHTML = '';
}


// ================= IRCTC BOOKING WINDOW CHECKER ================= 
const IRCTC_CONFIG = {
    ADVANCE_DAYS: 60, // Change to 120 anytime
    TIMEZONE: "Asia/Kolkata",
    BOOKING_HOUR: 8, // Booking opens at 8 AM IST
    BOOKING_MINUTE: 0
};

let irctcCountdownInterval;

// Time Utilities
function getISTDateTime() {
    const now = new Date();
    return new Date(
        now.toLocaleString("en-US", { timeZone: IRCTC_CONFIG.TIMEZONE })
    );
}

function getTodayIST() {
    const ist = getISTDateTime();
    return new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
}

function getLastBookingDate() {
    const today = getTodayIST();
    const now = getISTDateTime();
    const last = new Date(today);
    last.setDate(today.getDate() + IRCTC_CONFIG.ADVANCE_DAYS);
    
    // Set to 8 AM IST
    last.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    
    // If current time is before 8 AM today, the last booking date is actually yesterday + 60 days
    const todayAt8AM = new Date(today);
    todayAt8AM.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    
    if (now < todayAt8AM) {
        last.setDate(last.getDate() - 1);
    }
    
    return last;
}

function getNextBookingOpenTime() {
    const now = getISTDateTime();
    const today = getTodayIST();
    const todayAt8AM = new Date(today);
    todayAt8AM.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    
    if (now >= todayAt8AM) {
        // Next opening is tomorrow at 8 AM
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
        return tomorrow;
    } else {
        // Next opening is today at 8 AM
        return todayAt8AM;
    }
}

function formatDateIRCTC(date) {
    return date.toISOString().split("T")[0];
}

function diffInDays(date1, date2) {
    const diff = date1 - date2;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Initialize IRCTC Tool
function initIRCTCTool() {
    const checkBtn = document.getElementById('checkBookingBtn');
    if (checkBtn) {
        checkBtn.addEventListener('click', handleIRCTCButtonClick);
    }
    
    const resetBtn = document.getElementById('resetIRCTCBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetIRCTCFields);
    }
    
    // Display advance days
    const advanceDaysEl = document.getElementById('advanceDaysDisplay');
    if (advanceDaysEl) {
        advanceDaysEl.textContent = IRCTC_CONFIG.ADVANCE_DAYS;
    }
    
    const advanceDaysEl2 = document.getElementById('advanceDaysDisplay2');
    if (advanceDaysEl2) {
        advanceDaysEl2.textContent = IRCTC_CONFIG.ADVANCE_DAYS;
    }
    
    applyIRCTCDateLimit();
    scheduleIRCTCMidnightRefresh();
}

// Reset IRCTC fields
function resetIRCTCFields() {
    const journeyInput = document.getElementById('journeyDate');
    const resultDiv = document.getElementById('irctcResult');
    const countdownDiv = document.getElementById('irctcCountdown');
    const checkBtn = document.getElementById('checkBookingBtn');
    
    if (journeyInput) journeyInput.value = '';
    if (resultDiv) resultDiv.innerHTML = '';
    if (countdownDiv) countdownDiv.innerHTML = '';
    
    // Reset button to default state
    if (checkBtn) {
        checkBtn.textContent = 'Check Booking Status';
        checkBtn.className = 'irctc-check-btn';
        checkBtn.dataset.bookingOpen = 'false';
    }
    
    clearInterval(irctcCountdownInterval);
}

// Handle button click - either check status or book ticket
function handleIRCTCButtonClick() {
    const checkBtn = document.getElementById('checkBookingBtn');
    const isBookingOpen = checkBtn.dataset.bookingOpen === 'true';
    
    if (isBookingOpen) {
        // Open IRCTC booking page
        window.open('https://www.irctc.co.in/nget/train-search', '_blank');
    } else {
        // Check booking status
        checkIRCTCBooking();
    }
}

// Disable future dates beyond booking window
function applyIRCTCDateLimit() {
    const input = document.getElementById("journeyDate");
    if (!input) return;
    
    // Remove all restrictions - allow any date selection
    // Users can select any date and the system will tell them the booking status
    input.removeAttribute('min');
    input.removeAttribute('max');
}

// Main check function
function checkIRCTCBooking() {
    const inputVal = document.getElementById("journeyDate").value;
    const resultDiv = document.getElementById("irctcResult");
    
    if (!inputVal) {
        alert("Please select a journey date");
        return;
    }
    
    const journeyDate = new Date(inputVal + 'T00:00:00');
    const today = getTodayIST();
    const now = getISTDateTime();
    
    // Step 2: Calculate last booking date = today + 60 days at 8 AM
    const lastBookingDate = new Date(today);
    lastBookingDate.setDate(today.getDate() + IRCTC_CONFIG.ADVANCE_DAYS);
    lastBookingDate.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    
    // Adjust if current time is before 8 AM
    const todayAt8AM = new Date(today);
    todayAt8AM.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    if (now < todayAt8AM) {
        lastBookingDate.setDate(lastBookingDate.getDate() - 1);
    }
    
    // Step 3: Compare journey date with last booking date
    const isOpen = journeyDate <= lastBookingDate;
    const daysFromToday = diffInDays(journeyDate, today);
    
    let statusHTML = '';
    let statusClass = '';
    let message = '';
    let bookingOpenDate = null;
    let showBookButton = false;
    const checkBtn = document.getElementById('checkBookingBtn');
    
    if (journeyDate < today) {
        // Past date
        statusClass = 'status-past';
        message = '⚠️ This date has already passed';
        // Reset button to default
        if (checkBtn) {
            checkBtn.textContent = 'Check Booking Status';
            checkBtn.className = 'irctc-check-btn';
            checkBtn.dataset.bookingOpen = 'false';
        }
    } else if (isOpen) {
        // Step 4: TRUE - Booking is OPEN
        statusClass = 'status-open';
        message = `✅ OPEN FOR BOOKING<br><small>Journey is ${daysFromToday} days from today</small>`;
        showBookButton = true;
        // Change button to Book Tickets
        if (checkBtn) {
            checkBtn.textContent = '🎫 Book Tickets Now';
            checkBtn.className = 'irctc-check-btn book-mode';
            checkBtn.dataset.bookingOpen = 'true';
        }
    } else {
        // Step 4: FALSE - Booking NOT OPEN
        // Calculate exact opening date: journeyDate - 60 days at 8 AM
        bookingOpenDate = new Date(journeyDate);
        bookingOpenDate.setDate(journeyDate.getDate() - IRCTC_CONFIG.ADVANCE_DAYS);
        bookingOpenDate.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
        
        const daysUntilOpen = Math.ceil((bookingOpenDate - now) / (1000 * 60 * 60 * 24));
        const hoursUntilOpen = Math.ceil((bookingOpenDate - now) / (1000 * 60 * 60));
        
        statusClass = 'status-closed';
        message = `🔴 NOT OPEN<br>
            <div class="booking-opens-info">
                📅 Booking will open on:<br>
                <strong>${bookingOpenDate.toDateString()}</strong> at <strong>${IRCTC_CONFIG.BOOKING_HOUR}:00 AM IST</strong><br>
                <small>(${daysUntilOpen} days / ${hoursUntilOpen} hours from now)</small>
            </div>`;
        // Reset button to default
        if (checkBtn) {
            checkBtn.textContent = 'Check Booking Status';
            checkBtn.className = 'irctc-check-btn';
            checkBtn.dataset.bookingOpen = 'false';
        }
    }
    
    statusHTML = `
        <div class="result-card ${statusClass}">
            <div class="result-row">
                <span class="result-label">Current Time (IST):</span>
                <span class="result-value">${now.toLocaleString('en-IN', { 
                    timeZone: IRCTC_CONFIG.TIMEZONE,
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Journey Date:</span>
                <span class="result-value">${journeyDate.toDateString()}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Last Bookable Date:</span>
                <span class="result-value">${lastBookingDate.toDateString()} at ${IRCTC_CONFIG.BOOKING_HOUR}:00 AM</span>
            </div>
            <div class="result-status">
                ${message}
            </div>
            ${showBookButton ? `
                <div class="book-ticket-section">
                    <p class="book-note">✨ Click the "Book Tickets Now" button above to proceed to IRCTC website</p>
                </div>
            ` : ''}
        </div>
    `;
    
    resultDiv.innerHTML = statusHTML;
    
    // Show countdown for when booking will open (if not yet open)
    if (!isOpen && journeyDate >= today && bookingOpenDate) {
        startIRCTCCountdown(bookingOpenDate);
    } else if (isOpen && journeyDate >= today) {
        // Show countdown to next window shift
        startIRCTCCountdown(getNextBookingOpenTime());
    } else {
        clearInterval(irctcCountdownInterval);
        document.getElementById("irctcCountdown").innerHTML = '';
    }
}



// Countdown timer
function startIRCTCCountdown(targetDate) {
    clearInterval(irctcCountdownInterval);
    
    const countdownDiv = document.getElementById("irctcCountdown");
    
    irctcCountdownInterval = setInterval(() => {
        const now = getISTDateTime();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            countdownDiv.innerHTML = '<div class="countdown-complete">🎉 Booking window is now open! Click "Check Booking Status" to refresh.</div>';
            clearInterval(irctcCountdownInterval);
            // Auto refresh the check after 2 seconds
            setTimeout(() => {
                const journeyInput = document.getElementById("journeyDate");
                if (journeyInput && journeyInput.value) {
                    checkIRCTCBooking();
                }
            }, 2000);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        countdownDiv.innerHTML = `
            <div class="countdown-timer">
                ⏰ Time until booking opens: 
                <span class="countdown-value">${days}d ${hours}h ${minutes}m ${seconds}s</span>
            </div>
        `;
    }, 1000);
}

// Auto refresh at 8 AM IST
function scheduleIRCTCMidnightRefresh() {
    const now = getISTDateTime();
    const today = getTodayIST();
    
    // Next 8 AM
    let next8AM = new Date(today);
    next8AM.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 5, 0); // 5 seconds after 8 AM
    
    // If current time is past 8 AM today, schedule for tomorrow 8 AM
    if (now >= next8AM) {
        next8AM.setDate(next8AM.getDate() + 1);
    }
    
    const msUntil8AM = next8AM - now;
    
    setTimeout(() => {
        applyIRCTCDateLimit();
        scheduleIRCTCMidnightRefresh();
        
        // Refresh if result is showing
        const resultDiv = document.getElementById("irctcResult");
        if (resultDiv && resultDiv.innerHTML) {
            checkIRCTCBooking();
        }
    }, msUntil8AM);
}

// Initialize when tab is switched
document.addEventListener('DOMContentLoaded', function() {
    // Initialize IRCTC tool
    initIRCTCTool();
});
