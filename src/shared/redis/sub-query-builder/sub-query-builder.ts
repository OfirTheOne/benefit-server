import { SubQueryBuilder } from "../../../types/sub-query-builder.interface";


export class MatchTagQuery implements SubQueryBuilder {
    
    protected key?: string;
    protected value?: string;
    setArgs(key?: string, value?: string): MatchTagQuery {
        this.key = key;
        this.value = value;
        return this;
    }
    
    build(): string {
        return  this.key && this.value ?  `@${this.key}:{${this.value}}` : '';
    }
}

export class IncludeTextQuery implements SubQueryBuilder {
    protected keys: string[];
    protected value: string;
    setArgs(keys: string[] | string, value: string): IncludeTextQuery {
        this.keys = Array.isArray(keys) ? keys : [keys];
        this.value = value;
        return this;
    }
    
    build(): string {
        const textIncluded = `*${this.value.replace('*', '')}*`;
        return  this.keys.map(k => `@${k}:${textIncluded}`).join(' '); 
    }
}

export class MatchTextQuery implements SubQueryBuilder {
    protected keys: string[];
    protected value: string;

    setArgs(keys: string[] | string, value: string) {
        this.keys = Array.isArray(keys) ? keys : [keys];
        this.value = value;
        return this;
    }
    
    build(): string {
        return  this.keys.map(k => `@${k}:${this.value}`).join(' '); 
    }
}

export class MatchTextStartWithQuery implements SubQueryBuilder {
    protected keys: string[];
    protected value: string;

    setArgs(keys: string[] | string, value: string): MatchTextStartWithQuery {
        this.keys = Array.isArray(keys) ? keys : [keys];
        this.value = value;
        return this;
    }
    
    build(): string {
        const textIncluded = `${this.value.replace('*', '')}*`;
        return  this.keys.map(k => `@${k}:${textIncluded}`).join(' '); 
    }
}
