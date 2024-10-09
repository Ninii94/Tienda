import { Cloudinary } from 'cloudinary-react';

// Reemplaza estas credenciales con las tuyas
const cloudName = 'barbibibi';
const uploadPreset = 'munecas';

export const cloudinaryCore = new Cloudinary({
  cloud_name: cloudName,
  upload_preset: uploadPreset,
});