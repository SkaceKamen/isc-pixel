import bcrypt from 'bcrypt'
import { Column, Model, Table, Unique } from 'sequelize-typescript'

@Table({ paranoid: true })
export class User extends Model<User> {
	static async hashPassword(password: string) {
		return bcrypt.hash(password, 10)
	}

	@Unique
	@Column({ allowNull: false })
	username!: string

	@Unique
	@Column({ allowNull: false })
	email!: string

	@Column({ allowNull: false })
	password!: string

	async passwordMatch(password: string) {
		return bcrypt.compare(password, this.password)
	}
}
