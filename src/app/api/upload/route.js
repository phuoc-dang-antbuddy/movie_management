import { NextResponse } from "next/server"
import path from "path";
import fs, { writeFile } from "fs/promises";

export const POST = async (req, res) => {
  try {
    console.log('api image !!')
    await fs.readdir(path.join(process.cwd() + "/public", "/movies"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/movies"));
  }
  const formData = await req.formData();
  const file = formData.get('myImage');
  if(!file){
    return NextResponse.json({message: 'File not found'},{status:400})
  }
  const byteData = await file.arrayBuffer();
  const buffer = Buffer.from(byteData);
  const image_url = `./public/movies/${Date.now().toString()}_${file.name}`;
  await writeFile(image_url,buffer);
  return NextResponse.json({message: 'Upload success',image_url:image_url.slice(8)},{status:200})
};
