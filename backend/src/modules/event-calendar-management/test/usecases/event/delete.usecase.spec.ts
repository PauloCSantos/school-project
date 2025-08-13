import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/delete.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import EventGateway from '@/modules/event-calendar-management/application/gateway/event.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('DeleteEvent usecase unit test', () => {
  let repository: jest.Mocked<EventGateway>;
  let usecase: DeleteEvent;
  let event: Event;
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<EventGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<EventGateway>;
  };

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  let input: {
    creator: string;
    name: string;
    date: Date;
    hour: Hour;
    day: DayOfWeek;
    type: string;
    place: string;
  };

  beforeEach(() => {
    input = {
      creator: new Id().value,
      name: 'Christmas',
      date: new Date(),
      hour: '08:00' as Hour,
      day: 'mon' as DayOfWeek,
      type: 'event',
      place: 'school',
    };

    event = new Event(input);
    repository = MockRepository();
    policieService = MockPolicyService();
    usecase = new DeleteEvent(repository, policieService);
    token = {
      email: 'caller@domain.com',
      role: RoleUsersEnum.MASTER,
      masterId: new Id().value,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On fail', () => {
    it('should throw an error if the event does not exist', async () => {
      repository.find.mockResolvedValue(null);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' }, token)
      ).rejects.toThrow('Event not found');

      expect(repository.find).toHaveBeenCalledWith(
        token.masterId,
        '75c791ca-7a40-4217-8b99-2cf22c01d543'
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should delete an event', async () => {
      repository.find.mockResolvedValue(event);
      repository.delete.mockResolvedValue('Operação concluída com sucesso');
      const result = await usecase.execute(
        {
          id: event.id.value,
        },
        token
      );

      expect(repository.find).toHaveBeenCalledWith(
        token.masterId,
        event.id.value
      );
      expect(repository.delete).toHaveBeenCalledWith(
        token.masterId,
        event.id.value
      );
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
