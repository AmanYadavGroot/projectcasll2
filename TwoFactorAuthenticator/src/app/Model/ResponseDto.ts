export interface ResponseDto {
    isAuthSuccessful: boolean;
    isTfaEnabled: boolean;
    errorMessage: string;
    token: string;
    
}