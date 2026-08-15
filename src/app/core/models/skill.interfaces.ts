export interface Skill {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSkillDto {
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateSkillDto {
  name?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export interface SkillFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface BulkSkillStatusResult {
  succeeded: { id: string; isActive: boolean }[];
  failed: { id: string; reason: string }[];
}

export interface BulkSkillDeleteResult {
  succeeded: { id: string }[];
  failed: { id: string; reason: string }[];
}
