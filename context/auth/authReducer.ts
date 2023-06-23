import { AuthState } from "./"
import { IUser } from "@/interface";

type AuthActionType = 
| { type: '[Auth] - Login', payload: IUser }
| { type: '[Auth] - LoGGOUT' }

export const authReducer = (state: AuthState, action: AuthActionType): AuthState => {

    switch (action.type) {
        case '[Auth] - Login':
            
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            };
        
        case '[Auth] - LoGGOUT':
            
            return {
                ...state,
                isLoggedIn: false,
                user: undefined
            }

        default:
            return state;
    }
}




