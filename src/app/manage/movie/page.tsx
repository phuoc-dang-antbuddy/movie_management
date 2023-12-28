"use client";

import React from "react";
import apiClient from "@/services/apiClient";
import classes from "./style.module.css";
import { Pagination, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import logout from "../../../../public/image/logout.png";
import add from "../../../../public/image/add_circle.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

interface CinemaData {
  _id?: string;
  title: string;
  publishing_year: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface CinemaApiResponse {
  message: string;
  data: CinemaData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

export default function CinemaPage() {
  const router = useRouter();
  useEffect(() => {
    let user = localStorage.getItem("USER");
    if (!user) {
      router.push("/auth/login");
    }
  }, []);

  const [cinemaApiResponse, setCinemaApiResponse] =
    useState<CinemaApiResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await apiClient.get<CinemaApiResponse | undefined>(
        `/movie?pageSize=8&pageNumber=${currentPage}`
      );
      const data = response.data;
      setCinemaApiResponse(data);
      setIsLoading(false);
    };
    fetchData();
  }, [currentPage]);

  if (isLoading)
    return (
      <div className="flex justify-center content-center min-h-screen">
        <Spinner className="mt-60" />
      </div>
    );

  return (
    <div className={classes.ctn}>
      {cinemaApiResponse ? (
        <div className={classes["sub-ctn"]}>
          <div className={classes["list-movie-title"]}>
            <div className={classes["title-item"]}>
              <span className={classes["movie-content"]}>My movie</span>
              <Image
                className={classes["movie-img"]}
                onClick={() => {
                  router.push("/manage/movie/addEdit");
                }}
                src={add}
                alt="add"
              ></Image>
            </div>
            <div
              className={classes["title-item"]}
              onClick={() => {
                localStorage.removeItem("USER");
                router.push("/auth/login");
              }}
            >
              <span className={classes["logout-content"]}>Logout</span>
              <Image
                className={classes["movie-img"]}
                src={logout}
                alt="logout"
              ></Image>
            </div>
          </div>

          <div className={classes["list-movie-ctn"]}>
            {cinemaApiResponse.data.map((element, index) => {
              return <CinemaItem key={index} cinemaData={element} />;
            })}
          </div>

          <div className={classes.pagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={cinemaApiResponse.pagination.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      ) : (
        <div className={classes["empty-ctn"]}>
          <div className={classes.title}>Your movie list is empty</div>
          <button
            onClick={() => {
              router.push("/manage/movie/addEdit");
            }}
            className={classes.button}
          >
            Add a new movie
          </button>
        </div>
      )}
    </div>
  );
}

const CinemaItem: React.FC<{
  cinemaData: CinemaData | undefined;
  key: number;
}> = ({ cinemaData, key }) => {
  return (
    <>
      {cinemaData && (
        <div key={key} className={classes["item-ctn"]}>
          <Link
            href={{
              pathname: "movie/addEdit",
              query: {
                id: cinemaData._id,
              },
            }}
          >
            <Image
              width={226}
              height={400}
              className={classes["item-img"]}
              src={cinemaData.image}
              alt="movie-img"
            />
            <div className={classes["item-title"]}>{cinemaData.title}</div>
            <div className={classes["item-year"]}>
              {cinemaData.publishing_year}
            </div>
          </Link>
        </div>
      )}
    </>
  );
};
