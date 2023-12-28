import { NextResponse } from "next/server"
import connectMongo from '@/lib/mongodb'
import Movie from '@/models/movie'

export const PUT = async (req, {params}) =>{
    const {id} = params;
    const {title,publishing_year,image} = await req.json();
    await connectMongo();
    await Movie.findByIdAndUpdate(id,{title, publishing_year, image});
    return NextResponse.json({message: "Success update movie"},{status: 200});
}

export const GET = async (req, {params}) => {
    const isHttps = req.headers['x-forwarded-proto'] === 'https';
    const protocol = isHttps ? 'https' : 'http';
    const currentServerAddress = `${protocol}://${req.headers.get('host')}`;
    const {id} = params;
    await connectMongo();
    const movie = await Movie.findOne({_id: id});
    if(!movie) return NextResponse.json({message: 'Not found'},{status:400})
    movie.image = currentServerAddress + movie.image;
    return NextResponse.json({message: 'Get movie by id',data: movie},{status:200})
}

export const DELETE = async (req,{params}) => {
    const {id} = params;
    await connectMongo();
    await Movie.findByIdAndDelete(id);
    return NextResponse.json({message: 'Delete movie success'},{status:200})
}