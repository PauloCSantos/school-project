import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateEvent from '@/modules/event-calendar-management/application/usecases/event/update.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import EventGateway from '@/modules/event-calendar-management/application/gateway/event.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('UpdateEvent usecase unit test', () => {
  let repository: jest.Mocked<EventGateway>;
  let usecase: UpdateEvent;
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
  let dataToUpdate: {
    hour: Hour;
    day: DayOfWeek;
    type: string;
    place: string;
  };
  let event: Event;

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

    dataToUpdate = {
      hour: '09:30' as Hour,
      day: 'thu' as DayOfWeek,
      type: 'event',
      place: 'amusement park',
    };

    event = new Event(input);
    repository = MockRepository();
    policieService = MockPolicyService();
    usecase = new UpdateEvent(repository, policieService);
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

      const notFoundId = '75c791ca-7a40-4217-8b99-2cf22c01d543';

      await expect(
        usecase.execute(
          {
            ...dataToUpdate,
            id: notFoundId,
          },
          token
        )
      ).rejects.toThrow('Event not found');

      expect(repository.find).toHaveBeenCalledWith(token.masterId, notFoundId);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should update an event', async () => {
      repository.find.mockResolvedValue(event);
      repository.update.mockResolvedValue(event);

      const result = await usecase.execute(
        {
          id: event.id.value,
          ...dataToUpdate,
        },
        token
      );

      expect(repository.find).toHaveBeenCalledWith(token.masterId, event.id.value);
      expect(repository.update).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: event.id.value,
        creator: result.creator,
        name: result.name,
        date: result.date,
        hour: dataToUpdate.hour,
        day: dataToUpdate.day,
        type: dataToUpdate.type,
        place: dataToUpdate.place,
      });
    });

    it('should only update the provided fields', async () => {
      repository.find.mockResolvedValue(event);
      repository.update.mockResolvedValue(event);

      const partialUpdate = { hour: '10:00' as Hour };

      const result = await usecase.execute(
        {
          id: event.id.value,
          ...partialUpdate,
        },
        token
      );

      expect(repository.update).toHaveBeenCalledWith(
        token.masterId,
        expect.objectContaining({
          id: expect.objectContaining({ value: event.id.value }),
          hour: partialUpdate.hour,
          day: input.day,
          type: input.type,
          place: input.place,
        })
      );

      expect(result.hour).toBe(partialUpdate.hour);
      expect(result.day).toBe(input.day);
      expect(result.type).toBe(input.type);
      expect(result.place).toBe(input.place);
    });
  });
});
