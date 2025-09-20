export interface IGenericResponse<T> {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: T;
}
//# sourceMappingURL=common.d.ts.map