import {
  CreateEventInputDto,
  CreateEventOutputDto,
  DeleteEventInputDto,
  DeleteEventOutputDto,
  FindAllEventInputDto,
  FindAllEventOutputDto,
  FindEventInputDto,
  FindEventOutputDto,
  UpdateEventInputDto,
  UpdateEventOutputDto,
} from '../../dto/event-facade.dto';

export default interface EventFacadeInterface {
  create(input: CreateEventInputDto): Promise<CreateEventOutputDto>;
  find(input: FindEventInputDto): Promise<FindEventOutputDto | undefined>;
  findAll(input: FindAllEventInputDto): Promise<FindAllEventOutputDto>;
  delete(input: DeleteEventInputDto): Promise<DeleteEventOutputDto>;
  update(input: UpdateEventInputDto): Promise<UpdateEventOutputDto>;
}
