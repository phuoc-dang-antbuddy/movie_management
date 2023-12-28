import { NextRequest, NextResponse } from "next/server";
import {SignJWT, jwtVerify} from 'jose';

export async function middleware(req) {
    let token;
    if (req.cookies.has("token")) {
        token = req.cookies.get("token")?.value;
    } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
        token = req.headers.get("Authorization")?.substring(7);
    }

    // if(req.nextUrl.pathname.startsWith("/api/movie")) {
    //     try{
    //         console.log(token);
    //         if(!token) {
    //             return NextResponse.json({ message: "Not authentication"}, { status: 401 });
    //         }
    //         //const decodedToken = jwt.verify(token,process.env.KEY);
    //         const decodedToken =  await jwtVerify(token, new TextEncoder().encode(process.env.KEY));

    //         console.log('decode token: ',decodedToken)
    //         if(!decodedToken){
    //             return NextResponse.json({ message: "Not authentication"}, { status: 401 });
    //         }
    //     } catch(err){
    //         console.log('err verify token: ',err);
    //         return NextResponse.json({ message: "Not authentication"}, { status: 401 });
    //     }
    // }
    const response = NextResponse.next();
    return response;
}