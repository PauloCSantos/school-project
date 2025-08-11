import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateEvent from '@/modules/event-calendar-management/application/usecases/event/create.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import EventGateway from '@/modules/event-calendar-management/application/gateway/event.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('CreateEvent usecase unit test', () => {
  let repository: jest.Mocked<EventGateway>;
  let usecase: CreateEvent;
  let event: Event;
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<EventGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(event => Promise.resolve(event.id.value)),
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
    usecase = new CreateEvent(repository, policieService);
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
    it('should throw an error if the event already exists', async () => {
      repository.find.mockResolvedValue(event);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Event already exists'
      );
      expect(repository.find).toHaveBeenCalledWith(expect.any(String));
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create an event', async () => {
      repository.find.mockResolvedValue(null);

      const result = await usecase.execute(input, token);

      expect(repository.find).toHaveBeenCalledWith(expect.any(String));
      expect(repository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
