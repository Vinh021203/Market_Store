export const uploadFileToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file); // backend bạn đang dùng vẫn là 'image'

  const res = await fetch("http://localhost:5000/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Tải file thất bại");
  const data = await res.json();

  // Extract file info
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2); // MB
  const format = file.name.split(".").pop()?.toUpperCase() || "UNKNOWN";

  return {
    url: data.url,
    size: `${sizeMB} MB`,
    format,
  };
};
