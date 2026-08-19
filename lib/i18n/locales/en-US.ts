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
		},
		serverinfo: {
			name: 'serverinfo',
			description: 'Show information about the server',
			fields: {
				name: 'Name',
				id: 'ID',
				owner: 'Owner',
				createdAt: 'Created at',
				members: 'Members',
				roles: 'Roles',
				channels: 'Channels'
			}
		},
		avatar: {
			name: 'avatar',
			description: "Show a user's avatar",
			options: {
				user: {
					name: 'user',
					description: 'The user to look up'
				}
			},
			title: "{{username}}'s avatar"
		},
		help: {
			name: 'help',
			description: 'List all available commands',
			title: 'Available commands'
		},
		uptime: {
			name: 'uptime',
			description: 'Show how long the bot has been online',
			reply: 'I have been online since {{timestamp}}'
		},
		roleinfo: {
			name: 'roleinfo',
			description: 'Show information about a role',
			options: {
				role: {
					name: 'role',
					description: 'The role to look up'
				}
			},
			fields: {
				id: 'ID',
				color: 'Color',
				position: 'Position',
				members: 'Members',
				mentionable: 'Mentionable',
				hoisted: 'Hoisted',
				createdAt: 'Created at'
			}
		},
		channelinfo: {
			name: 'channelinfo',
			description: 'Show information about a channel',
			options: {
				channel: {
					name: 'channel',
					description: 'The channel to look up'
				}
			},
			fields: {
				id: 'ID',
				type: 'Type',
				category: 'Category',
				topic: 'Topic',
				createdAt: 'Created at'
			},
			types: {
				text: 'Text',
				voice: 'Voice',
				category: 'Category',
				announcement: 'Announcement',
				forum: 'Forum',
				stage: 'Stage'
			}
		},
		invite: {
			name: 'invite',
			description: 'Create an invite link for this channel',
			reply: 'Here is your invite link: {{url}}'
		}
	},
	common: {
		yes: 'Yes',
		no: 'No'
	},
	errors: {
		missingPermissions: '⚠️ I am missing the permissions required to run this command. Please check my role permissions in this server.',
		missingAccess: "⚠️ I don't have access to this channel or resource.",
		unexpected: '⚠️ Something went wrong while running this command.'
	}
};
