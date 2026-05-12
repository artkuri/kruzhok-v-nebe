import { ChildDto } from "../dto";
import { ChildRepository } from "../repositories/child.repository";

export class ChildService {
  constructor(private readonly childRepository: ChildRepository) {}

  async getChildren(familyId: string): Promise<ChildDto[]> {
    return this.childRepository.findByFamilyId(familyId);
  }

  async addChild(input: { familyId: string; name: string; birthDate: Date | null }) {
    if (!input.name.trim()) {
      throw new Error("Имя ребенка не может быть пустым.");
    }

    return this.childRepository.create({
      familyId: input.familyId,
      name: input.name.trim(),
      birthDate: input.birthDate,
    });
  }
}
