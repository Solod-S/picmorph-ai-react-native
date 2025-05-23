import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://192.168.0.157:1337/api",
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_STRAPI_API_KEY,
  },
});
// console.log(process.env.EXPO_PUBLIC_STRAPI_API_KEY);
const GetUserInfo = email =>
  axiosClient.get("user-lists?filters[userEmail][$eq]=" + email);

const CreateNewUser = data => axiosClient.post("/user-lists", { data: data });

const GetFeaturedCategoryList = () =>
  axiosClient.get("/ai-modals?filters[isFeatured]][$eq]=true&populate=*");

const GetAiModels = type =>
  axiosClient.get("/ai-modals?filters[" + type + "][$eq]=true&populate=*");

const AIGenerateImage = data =>
  axios.post("http://192.168.0.157:8081/aimodel", data);

const UpdateUserCredits = (documentId, data) =>
  axiosClient.put("/user-lists/" + documentId, { data: data });

const AddAiImageRecord = data =>
  axiosClient.post("/ai-generated-images", { data: data });

// const GetAllAiImages = pageSize => {
//   if (pageSize >= 20) return null;
//   return axiosClient.get(
//     "/ai-generated-images?pagination[start]=" +
//       (pageSize - 5) +
//       "&pagination[limit]=" +
//       pageSize
//   );
// };

const GetAllAiImages = pageSize => {
  if (pageSize >= 20) return null;
  return axiosClient.get(
    "/ai-generated-images?" +
      "pagination[start]=" +
      (pageSize - 5) +
      "&pagination[limit]=5" +
      "&sort=createdAt:desc"
  );
};

const GetAllUserImages = userEmail =>
  axiosClient.get("/ai-generated-images?filters[userEmail][$eq]=" + userEmail);

export default {
  GetUserInfo,
  CreateNewUser,
  GetFeaturedCategoryList,
  GetAiModels,
  AIGenerateImage,
  UpdateUserCredits,
  AddAiImageRecord,
  GetAllAiImages,
  GetAllUserImages,
};

// https://docs.strapi.io/cms/api/rest/filters
