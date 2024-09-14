import { User } from "./User";

export class Task {

  constructor() { }

  public visible: Boolean=true;
  public state: string;
  public title: string;
  public dir: string;
  public description: string;
  public dateCreation: Date;
  public dateFinish?: Date;
  public completed: boolean;
  public important: boolean;
  public userCreation: User;
  public user!: User;
  public images?: File[];
  public id: number;

}
