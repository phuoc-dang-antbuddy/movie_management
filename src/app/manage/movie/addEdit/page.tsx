"use client";

import apiClient from "@/services/apiClient";
import classes from "./style.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import download from "../../../../../public/image/file_download.png";

interface CinemaData {
  _id?: string;
  title: string;
  publishing_year: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result: any = {};
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

export default function AddEditMovie({
  searchParams,
}: {
  searchParams: {
    id: string;
  };
}) {
  let isEdit: boolean;
  const searchParamValue = searchParams.id;
  if (searchParamValue) {
    isEdit = true;
  } else isEdit = false;
  const router = useRouter();
  const [file, setFile] = useState();
  const [imageURL, setImageURL] = useState("");
  const [isEditImage, setIsEditImage] = useState(false);
  const [formData, setFormData] = useState<CinemaData>({
    title: "",
    publishing_year: 0,
    image: "",
  });

  useEffect(() => {
    if (searchParamValue) {
      const fetchData = async () => {
        const response = await apiClient.get(`/movie/${searchParamValue}`);
        const data = await response.data.data;

        setFormData({
          title: data.title,
          publishing_year: data.publishing_year,
          image: data.image,
        });
        setImageURL(data.image);
        return data;
      };
      fetchData();
    }
  }, [searchParamValue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let checkEmptyImage;
    if (isEdit) {
      checkEmptyImage = formData.image;
    } else {
      checkEmptyImage = file;
    }
    if (!checkEmptyImage) {
      toast.error("Please select images.");
      return;
    }
    if (
      Object.values(pick(formData, ["title", "publishing_year"])).some(
        (value) =>
          (typeof value === "string" && value.trim() === "") ||
          value === null ||
          value === undefined
      )
    ) {
      toast.error("Please fill in all the fields");
      return;
    }

    const uploadPromise = (async () => {
      if ((isEdit && isEditImage) || !isEdit) {
        const image = new FormData();
        image.append("myImage", file);

        const response = await apiClient.post(`/upload`, image);

        const result = await response.data;
        console.log(result);
        return result.image_url;
      }
    })();

    uploadPromise
      .then(async (uploadedImages) => {
        console.log("upload promise res: ", uploadedImages);
        formData.image = uploadedImages;
        let response;
        if (!isEdit) {
          response = await apiClient.post(
            `/movie`,
            JSON.stringify({ ...formData })
          );
        } else {
          response = await apiClient.put(
            `/movie/${searchParamValue}`,
            JSON.stringify({ ...formData })
          );
        }
        return response.data;
      })
      .then((result) => {
        router.push("/manage/movie");
        if (!isEdit) {
          toast.success("Add cinema successfully");
        } else {
          toast.success("Edit cinema successfully");
        }
        setFormData({
          title: "",
          publishing_year: 0,
          image: "",
        });
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className={classes["ctn"]}>
      <div className={classes["add-ctn"]}>
        <div className={classes["add-title"]}>
          {isEdit ? "Edit" : "Create a new movie"}
        </div>
        <form onSubmit={handleSubmit} className={classes["add-content"]}>
          <div className={classes["upload-ctn"]}>
            <div className={classes.upload}>
              <label className={classes.label}>
                <div
                  className={`${classes.label} ${
                    imageURL ? classes.opacity : ""
                  }`}
                >
                  <Image src={download} alt="download" />
                  <p className={classes["label-content"]}>
                    {!imageURL ? "Drop an image here" : "Drop other image here"}
                  </p>
                </div>
                <input
                  type="file"
                  name="image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (isEdit) {
                      setIsEditImage(true);
                    }
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setImageURL(event.target.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            {imageURL && (
              <div className={classes["img-url"]}>
                <img src={imageURL} alt="Uploaded Image" />
              </div>
            )}
          </div>
          <div className={classes["input-ctn"]}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className={classes.input}
              required
              value={formData.title}
              onChange={handleChange}
            />
            <input
              type="year"
              name="publishing_year"
              placeholder="Publishing year"
              className={`${classes.input} ${classes.year}`}
              required
              value={formData.publishing_year}
              onChange={handleChange}
            />
            <div className={classes["add-button-ctn"]}>
              <button
                className={`${classes["add-button"]} ${classes["cancel-button"]}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/manage/movie");
                }}
              >
                Cancel
              </button>
              <button
                className={`${classes["add-button"]} ${classes["submit-button"]}`}
                type="submit"
              >
                {isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
