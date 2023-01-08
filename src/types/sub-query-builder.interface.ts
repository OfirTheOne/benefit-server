
export interface SubQueryBuilder {
    setArgs(...args: any[]): SubQueryBuilder;
    build(): string 
}
