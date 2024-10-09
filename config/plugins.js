module.exports = ({ env }) => ({
    // ...
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('munecas'),
          api_key: env('883772123648256'),
          api_secret: env('KRoVu8hqKqQYlon7udxycNzu3r0'),
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
    // ...
  });