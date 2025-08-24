import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppUrl } from '../types/AppUrl.type';
import { NextURL } from 'next/dist/server/web/next-url';

export function middleware(req: NextRequest) {
    // const token = req.cookies.get('authToken');
    // console.log("middleware here");
    // if (!token) {
    const url = new NextURL(AppUrl.Dashboard.projects, req.url);
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url);
    // }

    // return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard'],
};
