import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApiUrl } from './types/ApiUrl.type';

export function middleware(req: NextRequest) {
    // const token = req.cookies.get('authToken');
    // console.log("middleware here");
    // if (!token) {
    return NextResponse.redirect(new URL(ApiUrl.Dashboard.projects, req.url));
    // }

    // return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard'],
};
