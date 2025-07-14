import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/find.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/event.gateway';

describe('FindEvent usecase unit test', () => {
  let repository: jest.Mocked<EventGateway>;
  let usecase: FindEvent;
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
    usecase = new FindEvent(repository);
    token = {
      email: 'caller@domain.com',
      role: 'master',
      masterId: new Id().value,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On success', () => {
    it('should find an event when it exists', async () => {
      repository.find.mockResolvedValue(event);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const result = await usecase.execute(
        { id: event.id.value },
        policieService,
        token
      );

      expect(repository.find).toHaveBeenCalledWith(event.id.value);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result).toEqual({
        id: event.id.value,
        creator: event.creator,
        name: event.name,
        date: event.date,
        hour: event.hour,
        day: event.day,
        type: event.type,
        place: event.place,
      });
    });

    it('should return null when id is not found', async () => {
      repository.find.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const notFoundId = '75c791ca-7a40-4217-8b99-2cf22c01d543';

      const result = await usecase.execute(
        {
          id: notFoundId,
        },
        policieService,
        token
      );

      expect(repository.find).toHaveBeenCalledWith(notFoundId);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });
});
