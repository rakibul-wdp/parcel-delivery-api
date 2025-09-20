export interface TErrorSources {
    path: string | number;
    message: string;
}
export interface TGenericErrorResponse {
    statusCode: number;
    message: string;
    errorSources?: TErrorSources[];
}
//# sourceMappingURL=error.types.d.ts.map