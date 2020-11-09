import {
	BelongsTo,
	Column,
	ForeignKey,
	Model,
	Table,
} from 'sequelize-typescript'
import { AuthClient } from './auth-client'
import { User } from './user'

@Table
export class AuthToken extends Model<AuthToken> {
	@ForeignKey(() => AuthClient as typeof Model)
	@Column({ allowNull: false })
	authClientId!: string

	@BelongsTo(() => AuthClient as typeof Model)
	authClient!: AuthClient

	@ForeignKey(() => User as typeof Model)
	@Column({ allowNull: false })
	userId!: number

	@BelongsTo(() => User as typeof Model)
	user!: User

	@Column({ allowNull: false })
	accessToken!: string
	@Column({ allowNull: false })
	accessTokenExpiresAt!: Date

	@Column({ allowNull: false })
	refreshToken!: string
	@Column({ allowNull: false })
	refreshTokenExpiresAt!: Date
}
