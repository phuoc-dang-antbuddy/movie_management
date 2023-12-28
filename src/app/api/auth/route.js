import { NextResponse } from "next/server"
import connectMongo from '@/lib/mongodb'
import User from '@/models/user'
import {SignJWT, jwtVerify} from 'jose';

export const POST = async (req, res) =>{
    const {username, password} = await req.json();
    await connectMongo();
    const user = await User.findOne({username, password});
    if(!user) return NextResponse.json({message: "Not authentication"},{status: 401});

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60* 60; // one hour

    // create token using jose
    const payload = {username: user.username, password: user.password};

    const token = await new SignJWT({...payload})
    .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.KEY));

    console.log('token: ', token)
    //const token = jwt.sign({username: user.username, password: user.password},process.env.KEY)
    return NextResponse.json({message: "Success login",token:token},{status: 200});
}
