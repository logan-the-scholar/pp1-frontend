import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApiUrl } from '../types/ApiUrl.type';
import { NextURL } from 'next/dist/server/web/next-url';

export function middleware(req: NextRequest) {
    // const token = req.cookies.get('authToken');
    // console.log("middleware here");
    // if (!token) {
    const url = new NextURL(ApiUrl.Dashboard.projects, req.url);
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url);
    // }

    // return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard'],
};
