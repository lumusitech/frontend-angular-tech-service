// @ts-nocheck
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