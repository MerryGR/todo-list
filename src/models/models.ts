import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "users",
})

export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
}

@Table({
  timestamps: false,
  tableName: "todos",
})

export class TodoRow extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  deadline!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  createdby!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  flags!: string;
}

@Table({
  timestamps: false,
  tableName: "todosname",
})

export class TodoNames extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  createdby!: string;
}
