/**
 * Format date to Thai locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    
    return d.toLocaleDateString('th-TH', options);
};

/**
 * Format date to short format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (DD/MM/YYYY)
 */
export const formatDateShort = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear() + 543; // พุทธศักราชไทย
    
    return `${day}/${month}/${year}`;
};

/**
 * Format datetime to string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted datetime string
 * "24 มีนาคม 2569 14:30"
 */
export const formatDateTime = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
