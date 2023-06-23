import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

 
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

    const previousPage = req.nextUrl.pathname;
 
    if (previousPage.startsWith('/checkout')) {
      const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

      if (!session) {
        const url = req.nextUrl.clone()
        url.pathname = `/auth/login`
        url.search = `p=${previousPage}`

        return NextResponse.redirect( url )
      }

      return NextResponse.next()
    }
    
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/checkout/:path*'],
};


