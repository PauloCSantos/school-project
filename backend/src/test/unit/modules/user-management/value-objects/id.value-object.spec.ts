import Id from '@/modules/user-management/@shared/domain/value-object/id.value-object';

describe('Id unit test', () => {
  describe('On fail', () => {
    it('should throw an error for an invalid ID format', () => {
      const invalidId = 'invalid-id-format';
      expect(() => new Id(invalidId)).toThrow('ID inválido');
    });
  });
  describe('On success', () => {
    it('should generate a valid ID if no ID is provided', () => {
      const id = new Id();
      expect(id.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
    it('should create an Id object with a valid ID when provided', () => {
      const validId = '9a2d6b9e-a7c8-4f15-b5e2-1d3c9c2e4a5f';
      const id = new Id(validId);
      expect(id.id).toBe(validId);
    });
  });
});
