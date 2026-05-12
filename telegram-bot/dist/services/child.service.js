"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildService = void 0;
class ChildService {
    childRepository;
    constructor(childRepository) {
        this.childRepository = childRepository;
    }
    async getChildren(familyId) {
        return this.childRepository.findByFamilyId(familyId);
    }
    async addChild(input) {
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
exports.ChildService = ChildService;
