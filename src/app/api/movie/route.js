import { NextResponse } from "next/server"
import connectMongo from '@/lib/mongodb'
import Movie from '@/models/movie'

export const POST = async (req, res) => {
    const { title, publishing_year, image } = await req.json();
    await connectMongo();
    const newMovie = await Movie.create({ title, publishing_year, image });
    return NextResponse.json({ message: "Success create movie", data: newMovie }, { status: 200 });
}

export const GET = async (req, res) => {
    const isHttps = req.headers['x-forwarded-proto'] === 'https';
    const protocol = isHttps ? 'https' : 'http';
    const currentServerAddress = `${protocol}://${req.headers.get('host')}`;

    // paginate

    console.log('req : ', req.nextUrl.searchParams)
    const pageNumber = parseInt(req.nextUrl.searchParams.get('pageNumber')) || 1;
    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize')) || 8;
    const skip = (pageNumber - 1) * pageSize;

    console.log('skip: ',skip)
    //get movies
    await connectMongo();
    const movies = await Movie.find({}).sort({updatedAt: -1}).skip(skip).limit(pageSize);

    const totalCount = await Movie.countDocuments({});
    const totalPages = Math.ceil(totalCount / pageSize);

    const returnListMovies = movies.map(movie => {
        return {
            ...movie._doc,
            image: `${currentServerAddress}${movie.image}`,
        }
    })
    return NextResponse.json({
        message: 'Get all movie',
        data: returnListMovies,
        pagination: {
            currentPage: pageNumber,
            totalPages: totalPages,
            totalItems: totalCount,
            pageSize
        }
    }, { status: 200 })
}