import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const AddItem = () => {
    const { getToken } = useAuth();
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const handleUpload = async () => {
        if (!image || !title) {
            alert("Title and image are required.");
            return;
        }

        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);

            const res = await axios.post("http://localhost:5000/api/items", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Uploaded:", res.data);
            alert("Upload successful!");
        } catch (error: any) {
            console.error("❌ Upload failed:", error);
            alert(error?.response?.data?.message || error.message || "Upload failed");
        }
    };

    return (
        <div>
            <h2>Add Item</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setImage(file);
                        setPreviewUrl(URL.createObjectURL(file));
                    }
                }}
            />
            {previewUrl && <img src={previewUrl} alt="preview" width={200} />}
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default AddItem;
