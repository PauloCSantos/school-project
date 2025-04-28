export interface IFindEventInput {
  id: string;
}

export interface IFindEventOutput {
  id: string;
  creator: string;
  name: string;
  date: Date;
  hour: string;
  day: string;
  type: string;
  place: string;
}

export interface IFindAllEventInput {
  quantity?: number;
  offset?: number;
}

export interface IFindAllEventOutput
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

export interface ICreateEventInput {
  creator: string;
  name: string;
  date: Date;
  hour: Hour;
  day: DayOfWeek;
  type: string;
  place: string;
}

export interface ICreateEventOutput {
  id: string;
}

export interface IUpdateEventInput {
  id: string;
  creator?: string;
  name?: string;
  date?: Date;
  hour?: Hour;
  day?: DayOfWeek;
  type?: string;
  place?: string;
}

export interface IUpdateEventOutput {
  id: string;
  creator: string;
  name: string;
  date: Date;
  hour: string;
  day: string;
  type: string;
  place: string;
}

export interface IDeleteEventInput {
  id: string;
}

export interface IDeleteEventOutput {
  message: string;
}
