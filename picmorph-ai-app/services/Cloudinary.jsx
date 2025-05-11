import { Cloudinary } from "@cloudinary/url-gen";
import axios from "axios";
import sha1 from "js-sha1";
// import crypto from "crypto";

const cloudName = process.env.EXPO_PUBLIC_CLOUD_NAME;
const apiKey = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET;
const upload_preset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
console.log(apiSecret);
export const cld = new Cloudinary({
  cloud: {
    cloudName,
    apiKey,
  },
  url: {
    secure: true,
  },
});

export const options = {
  upload_preset,
  unsigned: true,
};

// export const deleteCloudinaryImage = async imgPublicId => {
//   try {
//     const timestamp = Math.floor(Date.now() / 1000);
//     const signature = crypto
//       .createHash("sha1")
//       .update(`public_id=${imgPublicId}&timestamp=${timestamp}${apiSecret}`)
//       .digest("hex");

//     const result = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
//       null,
//       {
//         params: {
//           public_id: imgPublicId,
//           api_key: apiKey,
//           timestamp,
//           signature,
//         },
//       }
//     );

//     console.log("Image deleted successfully:", result?.data);
//   } catch (error) {
//     console.error("Error deleting image:", error);
//   }
// };

export const deleteCloudinaryImage = async imgPublicId => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `public_id=${imgPublicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = sha1(stringToSign);

    const result = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      null,
      {
        params: {
          public_id: imgPublicId,
          api_key: apiKey,
          timestamp,
          signature,
        },
      }
    );

    console.log("Image deleted successfully:", result?.data);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
