import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  CreateEventInputDto,
  CreateEventOutputDto,
  DeleteEventInputDto,
  DeleteEventOutputDto,
  FindEventInputDto,
  FindEventOutputDto,
  FindAllEventInputDto,
  FindAllEventOutputDto,
  UpdateEventInputDto,
  UpdateEventOutputDto,
} from '../../application/dto/event-usecase.dto';
import CreateEvent from '../../application/usecases/event/create.usecase';
import FindEvent from '../../application/usecases/event/find.usecase';
import FindAllEvent from '../../application/usecases/event/find-all.usecase';
import UpdateEvent from '../../application/usecases/event/update.usecase';
import DeleteEvent from '../../application/usecases/event/delete.usecase';
import EventController from '../../interface/controller/event.controller';

const mockCreateEvent: jest.Mocked<CreateEvent> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateEvent>;

const mockFindEvent: jest.Mocked<FindEvent> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<FindEvent>;

const mockFindAllEvent: jest.Mocked<FindAllEvent> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<FindAllEvent>;

const mockUpdateEvent: jest.Mocked<UpdateEvent> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<UpdateEvent>;

const mockDeleteEvent: jest.Mocked<DeleteEvent> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<DeleteEvent>;

describe('EventController unit test', () => {
  let controller: EventController;

  const id = new Id().value;
  const creator = 'dfcd1710-de67-45f4-9ba1-6a07cc66609f';

  const createInput: CreateEventInputDto = {
    creator,
    name: 'Christmas',
    date: new Date('2024-02-09T11:40:50.095Z'),
    hour: '08:00',
    day: 'mon',
    type: 'event',
    place: 'school',
  };
  const createOutput: CreateEventOutputDto = { id };

  const findInput: FindEventInputDto = { id };
  const findOutput: FindEventOutputDto = {
    id,
    creator,
    name: 'Christmas',
    date: new Date('2024-02-09T11:40:50.095Z'),
    hour: '08:00',
    day: 'mon',
    type: 'event',
    place: 'school',
  };

  const findAllInput: FindAllEventInputDto = {};
  const findAllOutput: FindAllEventOutputDto = [
    {
      id,
      creator,
      name: 'Christmas',
      date: new Date('2024-02-09T11:40:50.095Z'),
      hour: '08:00',
      day: 'mon',
      type: 'event',
      place: 'school',
    },
    {
      id,
      creator,
      name: 'Holiday',
      date: new Date('2024-02-09T11:40:50.095Z'),
      hour: '17:00',
      day: 'fri',
      type: 'event',
      place: 'school',
    },
  ];

  const updateInput: UpdateEventInputDto = {
    id,
    name: 'Holiday',
  };
  const updateOutput: UpdateEventOutputDto = {
    id,
    creator,
    name: 'Christmas',
    date: new Date('2024-02-09T11:40:50.095Z'),
    hour: '08:00',
    day: 'mon',
    type: 'event',
    place: 'school',
  };

  const deleteInput: DeleteEventInputDto = { id };
  const deleteOutput: DeleteEventOutputDto = {
    message: 'Operação concluída com sucesso',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateEvent.execute.mockResolvedValue(createOutput);
    mockFindEvent.execute.mockResolvedValue(findOutput);
    mockFindAllEvent.execute.mockResolvedValue(findAllOutput);
    mockUpdateEvent.execute.mockResolvedValue(updateOutput);
    mockDeleteEvent.execute.mockResolvedValue(deleteOutput);

    controller = new EventController(
      mockCreateEvent,
      mockFindEvent,
      mockFindAllEvent,
      mockUpdateEvent,
      mockDeleteEvent
    );
  });

  it('should call create use case with correct input and return its output', async () => {
    const result = await controller.create(createInput);

    expect(mockCreateEvent.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateEvent.execute).toHaveBeenCalledWith(createInput);
    expect(result).toEqual(createOutput);
  });

  it('should call find use case with correct input and return its output', async () => {
    const result = await controller.find(findInput);

    expect(mockFindEvent.execute).toHaveBeenCalledTimes(1);
    expect(mockFindEvent.execute).toHaveBeenCalledWith(findInput);
    expect(result).toEqual(findOutput);
  });

  it('should call findAll use case with correct input and return its output', async () => {
    const result = await controller.findAll(findAllInput);

    expect(mockFindAllEvent.execute).toHaveBeenCalledTimes(1);
    expect(mockFindAllEvent.execute).toHaveBeenCalledWith(findAllInput);
    expect(result).toEqual(findAllOutput);
    expect(result.length).toBe(2);
  });

  it('should call update use case with correct input and return its output', async () => {
    const result = await controller.update(updateInput);

    expect(mockUpdateEvent.execute).toHaveBeenCalledTimes(1);
    expect(mockUpdateEvent.execute).toHaveBeenCalledWith(updateInput);
    expect(result).toEqual(updateOutput);
  });

  it('should call delete use case with correct input and return its output', async () => {
    const result = await controller.delete(deleteInput);

    expect(mockDeleteEvent.execute).toHaveBeenCalledTimes(1);
    expect(mockDeleteEvent.execute).toHaveBeenCalledWith(deleteInput);
    expect(result).toEqual(deleteOutput);
  });
});
