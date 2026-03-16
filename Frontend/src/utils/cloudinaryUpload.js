/**
 * Upload image to GitHub (via backend) and serve via jsDelivr
 * @param {File} file - Image file to upload
 * @param {string} type - Type of content (e.g., 'courses', 'blogs') -> maps to backend 'section'
 * @returns {Promise<string>} - CDN URL of uploaded image
 */
export const uploadToCloudinary = async (file, type = 'misc') => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('section', type);

  // Use relative path for proxy, or full URL for dev
  // In production, backend and frontend might be on same domain or need configured URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${API_URL}/api/upload-image`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.cdnUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param {FileList} files - Multiple image files
 * @returns {Promise<string[]>} - Array of uploaded image URLs
 */
export const uploadMultipleToCloudinary = async (files) => {
  const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
};
