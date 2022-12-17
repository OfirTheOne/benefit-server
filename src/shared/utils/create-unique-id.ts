

import { randomUUID } from "crypto";

export function createUniqueId(): string {
    return randomUUID();
}