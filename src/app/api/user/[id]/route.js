import { NextResponse } from "next/server"
import connectMongo from '@/lib/mongodb'
import User from '@/models/user'

export const PUT = async (req, {params}) =>{
    const {id} = params;
    const {username,password,role} = await req.json();
    await connectMongo();
    await User.findByIdAndUpdate(id,{username, password, role});
    return NextResponse.json({message: "Success update user"},{status: 200});
}

export const GET = async (req, {params}) => {
    const {id} = params;
    await connectMongo();
    const user = await User.findOne({_id: id});
    return NextResponse.json({message: 'Get user by id',data: user},{status:200})
}