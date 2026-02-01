export interface BeforeAfterCase {
  id: number;
  before: string;
  after: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export class BeforeAfterModel {
  id: number | null;
  before: string | null;
  after: string | null;
  description: string | null;

  constructor(data?: Partial<BeforeAfterModel>) {
    this.id = data?.id ?? null;
    this.before = data?.before ?? null;
    this.after = data?.after ?? null;
    this.description = data?.description ?? null;
  }
}

