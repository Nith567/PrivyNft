import axios from "axios";

const upload = async (file:string) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "localservice")
  data.append("api_key", "642747872745723")
  try {
    const res = await axios.post("https://api.cloudinary.com/v1_1/ds2wxteop/image/upload", data);
    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};
export default upload;
