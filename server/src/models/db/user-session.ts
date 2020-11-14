import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export class UserSession extends Model<UserSession> {
	@PrimaryKey
	@Column({ allowNull: false })
	id!: string

	@Column({ allowNull: false })
	pixels!: number

	@Column
	reloadsAt?: Date

	@Column({ allowNull: false })
	expiresAt!: Date
}
