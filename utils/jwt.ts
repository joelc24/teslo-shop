import * as jose from 'jose'


// export const signToken = (_id:string, email:string) =>{
    
//     if (!process.env.JWT_SECRET_SEED) {
//         throw new Error("No hay semilla de JWT - Revisar de variables de entorno");
        
//     }

//     return jwt.sign(
//         //Payload
//         { _id, email },

//         // Seed
//         process.env.JWT_SECRET_SEED,

//         // Opciones
//         { expiresIn: '30d' }
//     )

// }

export const signToken = async (_id:string, email:string) =>{
    
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error("No hay semilla de JWT - Revisar de variables de entorno");
        
    }
    const alg = 'HS256'

    return await new jose.SignJWT({ _id, email })
                         .setProtectedHeader({ alg })
                         .setExpirationTime('30d')
                         .sign(new TextEncoder().encode(process.env.JWT_SECRET_SEED!))

}

export const isValidToken = async(token:string): Promise<string> =>{

    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    }

    if ( token.length <= 10 ) {
        return Promise.reject('JWT no es válido');
    }

    try {
       const { payload } =  await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED!))
       const { _id } = payload as { _id:string }
       return _id
    } catch (error) {
        return 'JWT no valido'
    }
}

// export const isValidToken = (token:string): Promise<string> =>{

//     if ( !process.env.JWT_SECRET_SEED ) {
//         throw new Error('No hay semilla de JWT - Revisar variables de entorno');
//     }

//     if ( token.length <= 10 ) {
//         return Promise.reject('JWT no es válido');
//     }

//     return new Promise( (resolve, reject) => {

//         try {
//             jwt.verify( token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
//                 if ( err ) return reject('JWT no es válido');

//                 const { _id } = payload as { _id: string };

//                 resolve(_id);

//             })
//         } catch (error) {
//             reject('JWT no es válido');
//         }


//     })
// }