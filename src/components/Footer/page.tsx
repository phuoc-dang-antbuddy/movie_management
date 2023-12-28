"use client";
import Image from "next/image";
import classes from "./style.module.css";
import footer from "../../../public/image/vectors.png";

export default function Footer() {
  return <Image className={classes.image} src={footer} alt="footer" />;
}
