export interface FindEventInputDto {
  id: string;
}
export interface FindEventOutputDto {
  id: string;
  creator: string;
  name: string;
  date: Date;
  hour: string;
  day: string;
  type: string;
  place: string;
}

export interface FindAllEventInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllEventOutputDto
  extends Array<{
    id: string;
    creator: string;
    name: string;
    date: Date;
    hour: string;
    day: string;
    type: string;
    place: string;
  }> {}

export interface CreateEventInputDto {
  creator: string;
  name: string;
  date: Date;
  hour: Hour;
  day: DayOfWeek;
  type: string;
  place: string;
}
export interface CreateEventOutputDto {
  id: string;
}

export interface UpdateEventInputDto {
  id: string;
  creator?: string;
  name?: string;
  date?: Date;
  hour?: Hour;
  day?: DayOfWeek;
  type?: string;
  place?: string;
}
export interface UpdateEventOutputDto {
  id: string;
  creator: string;
  name: string;
  date: Date;
  hour: string;
  day: string;
  type: string;
  place: string;
}

export interface DeleteEventInputDto {
  id: string;
}
export interface DeleteEventOutputDto {
  message: string;
}
