import { NextResponse } from "next/server"
import connectMongo from '@/lib/mongodb'
import User from '@/models/user'

export const POST = async (req, res) =>{
    const {username, password, role} = await req.json();
    await connectMongo();
    const newUser = await User.create({username, password, role});
    return NextResponse.json({message: "Success create user",data:newUser},{status: 200});
}

export const GET = async (req, res) => {
    await connectMongo();
    const users = await User.find({});
    return NextResponse.json({message: 'Get all user',data: users},{status:200})
}