import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindAllEvent from '@/modules/event-calendar-management/application/usecases/event/find-all.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import EventGateway from '@/modules/event-calendar-management/application/gateway/event.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('findAllEvent usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<EventGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  };
  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  const event1 = new Event({
    creator: new Id().value,
    name: 'Christmas',
    date: new Date(),
    hour: '08:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'event',
    place: 'school',
  });
  const event2 = new Event({
    creator: new Id().value,
    name: 'Summer',
    date: new Date(),
    hour: '14:00' as Hour,
    day: 'fri' as DayOfWeek,
    type: 'event',
    place: 'school',
  });
  policieService = MockPolicyService();
  token = {
    email: 'caller@domain.com',
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };

  describe('On success', () => {
    it('should find all events', async () => {
      const eventRepository = MockRepository();
      eventRepository.findAll.mockResolvedValue([event1, event2]);

      const usecase = new FindAllEvent(eventRepository, policieService);

      const result = await usecase.execute({}, token);

      expect(eventRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const eventRepository = MockRepository();
      eventRepository.findAll.mockResolvedValue([]);

      const usecase = new FindAllEvent(eventRepository, policieService);

      const result = await usecase.execute({}, token);

      expect(eventRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
