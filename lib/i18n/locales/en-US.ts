export default {
	commands: {
		ping: {
			name: 'ping',
			description: 'Replies with Pong!',
			reply: 'Pong! Latency: {{latency}}ms'
		},
		userinfo: {
			name: 'userinfo',
			description: 'Show information about a member',
			options: {
				member: {
					name: 'member',
					description: 'The member to look up'
				}
			},
			fields: {
				nickname: 'Nickname',
				joinedAt: 'Joined server',
				createdAt: 'Account created',
				roles: 'Roles',
				noRoles: 'No roles'
			}
		}
	},
	errors: {
		missingPermissions: '⚠️ I am missing the permissions required to run this command. Please check my role permissions in this server.',
		missingAccess: "⚠️ I don't have access to this channel or resource.",
		unexpected: '⚠️ Something went wrong while running this command.'
	}
};
