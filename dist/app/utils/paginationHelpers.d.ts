interface IPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
interface IPaginationResult {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
}
export declare const paginationHelpers: {
    calculatePagination: (options: IPaginationOptions) => IPaginationResult;
};
export {};
//# sourceMappingURL=paginationHelpers.d.ts.map