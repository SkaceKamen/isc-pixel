import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({ paranoid: true })
export class AuthClient extends Model<AuthClient> {
	@PrimaryKey
	@Column({ allowNull: false })
	id!: string

	@Column({ allowNull: false })
	secret!: string
}
