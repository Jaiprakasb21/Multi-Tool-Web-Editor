// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}Section`).classList.add('active');
        });
    });

    // JSON Formatter
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatBtn = document.getElementById('formatBtn');
    const expandAllBtn = document.getElementById('expandAll');
    const collapseAllBtn = document.getElementById('collapseAll');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');

    formatBtn.addEventListener('click', formatJSON);
    expandAllBtn.addEventListener('click', () => toggleAll(true));
    collapseAllBtn.addEventListener('click', () => toggleAll(false));
    copyBtn.addEventListener('click', copyToClipboard);
    exportBtn.addEventListener('click', exportJSON);

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
        if (e.target.classList.contains('convert-btn')) {
            const format = e.target.getAttribute('data-format');
            convertFile(format);
        }
    });

    // Image Editor
    const imageInput = document.getElementById('imageInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileName = document.getElementById('fileName');
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

function formatJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        jsonOutput.innerHTML = '<div class="error-message">Please enter JSON data</div>';
        return;
    }
    
    try {
        parsedData = JSON.parse(input);
        jsonOutput.innerHTML = renderJSON(parsedData);
        attachToggleListeners();
    } catch (error) {
        jsonOutput.innerHTML = `<div class="error-message">Invalid JSON: ${error.message}</div>`;
    }
}

function renderJSON(data, level = 0) {
    const indent = level * 20;
    
    if (data === null) {
        return `<span class="json-null">null</span>`;
    }
    
    if (typeof data === 'string') {
        return `<span class="json-string">"${escapeHtml(data)}"</span>`;
    }
    
    if (typeof data === 'number') {
        return `<span class="json-number">${data}</span>`;
    }
    
    if (typeof data === 'boolean') {
        return `<span class="json-boolean">${data}</span>`;
    }
    
    if (Array.isArray(data)) {
        if (data.length === 0) {
            return '<span>[]</span>';
        }
        
        const id = generateId();
        let html = `<div class="json-line">`;
        html += `<span class="json-toggle" data-id="${id}">▼</span>`;
        html += `<span>[${data.length} items]</span>`;
        html += `</div>`;
        html += `<div class="json-content" id="${id}" style="padding-left: ${indent + 20}px">`;
        
        data.forEach((item, index) => {
            html += `<div class="json-line">`;
            html += `<span class="json-key">[${index}]:</span> `;
            html += renderJSON(item, level + 1);
            html += `</div>`;
        });
        
        html += `</div>`;
        return html;
    }
    
    if (typeof data === 'object') {
        const keys = Object.keys(data);
        
        if (keys.length === 0) {
            return '<span>{}</span>';
        }
        
        const id = generateId();
        let html = `<div class="json-line">`;
        html += `<span class="json-toggle" data-id="${id}">▼</span>`;
        html += `<span>{${keys.length} keys}</span>`;
        html += `</div>`;
        html += `<div class="json-content" id="${id}" style="padding-left: ${indent + 20}px">`;
        
        keys.forEach(key => {
            html += `<div class="json-line">`;
            html += `<span class="json-key">"${escapeHtml(key)}":</span> `;
            html += renderJSON(data[key], level + 1);
            html += `</div>`;
        });
        
        html += `</div>`;
        return html;
    }
    
    return String(data);
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
    link.click();
    
    URL.revokeObjectURL(url);
    
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Exported!';
    setTimeout(() => {
        exportBtn.textContent = originalText;
    }, 2000);
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
    // Check if it's a data URL or raw base64
    let dataUrl = base64;
    let mimeType = 'application/octet-stream';
    
    if (base64.startsWith('data:')) {
        // Extract mime type from data URL
        const mimeMatch = dataUrl.match(/data:([^;]+);base64,/);
        mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    } else {
        // Try to detect file type from base64 signature
        const signature = base64.substring(0, 20);
        if (signature.startsWith('iVBORw0KGgo')) {
            mimeType = 'image/png';
            dataUrl = 'data:image/png;base64,' + base64;
        } else if (signature.startsWith('/9j/')) {
            mimeType = 'image/jpeg';
            dataUrl = 'data:image/jpeg;base64,' + base64;
        } else if (signature.startsWith('R0lGODlh') || signature.startsWith('R0lGODdh')) {
            mimeType = 'image/gif';
            dataUrl = 'data:image/gif;base64,' + base64;
        } else if (signature.startsWith('UklGR')) {
            mimeType = 'image/webp';
            dataUrl = 'data:image/webp;base64,' + base64;
        } else if (signature.startsWith('JVBERi0')) {
            mimeType = 'application/pdf';
            dataUrl = 'data:application/pdf;base64,' + base64;
        } else {
            // Default to PNG if unknown
            mimeType = 'image/png';
            dataUrl = 'data:image/png;base64,' + base64;
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
    
    fileName.textContent = file.name;
    
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
    
    const quality = parseFloat(qualitySlider.value);
    
    if (format === 'pdf-to-png' || format === 'pdf-to-jpeg') {
        alert('PDF to image conversion requires a PDF rendering library. This is a browser limitation. Please use online tools or desktop software for PDF conversion.');
        return;
    }
    
    if (currentFile.type.startsWith('image/')) {
        convertImage(currentFile, format, quality);
    }
}

function convertImage(file, targetFormat, quality) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
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
            
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                link.download = `${originalName}_converted.${extension}`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                
                alert(`File converted to ${targetFormat.toUpperCase()} successfully!`);
            }, mimeType, quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
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
