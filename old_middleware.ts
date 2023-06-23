import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

 
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

    const previousPage = req.nextUrl.pathname;
 
    if (previousPage.startsWith('/checkout')) {
      const token = req.cookies.get('token')?.value || '';
        console.log("token =>",token)
      try {
        const userId = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
        console.log("user =>", userId)
        return NextResponse.next();
    } catch (error) {
        console.log("error => ", error)
        return NextResponse.redirect(
            new URL(`/auth/login?p=${previousPage}`, req.url)
            );
        }
    }
    
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/checkout/:path*'],
};