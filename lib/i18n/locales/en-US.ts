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
		},
		kick: {
			name: 'kick',
			description: 'Kick a member from the server',
			options: {
				member: {
					name: 'member',
					description: 'The member to kick'
				},
				reason: {
					name: 'reason',
					description: 'The reason for the kick'
				}
			},
			reply: '👢 Kicked {{target}}. Reason: {{reason}}'
		},
		ban: {
			name: 'ban',
			description: 'Ban a user from the server',
			options: {
				user: {
					name: 'user',
					description: 'The user to ban'
				},
				reason: {
					name: 'reason',
					description: 'The reason for the ban'
				},
				deleteMessageSeconds: {
					name: 'delete_message_seconds',
					description: "Delete this user's messages sent in the last X seconds (max 7 days)"
				}
			},
			reply: '🔨 Banned {{target}}. Reason: {{reason}}'
		},
		unban: {
			name: 'unban',
			description: 'Unban a user from the server',
			options: {
				user: {
					name: 'user',
					description: 'The user to unban'
				},
				reason: {
					name: 'reason',
					description: 'The reason for the unban'
				}
			},
			reply: '✅ Unbanned {{target}}. Reason: {{reason}}'
		},
		mute: {
			name: 'mute',
			description: 'Temporarily mute a member',
			options: {
				member: {
					name: 'member',
					description: 'The member to mute'
				},
				duration: {
					name: 'duration',
					description: 'Mute duration in minutes (max 40320, 28 days)'
				},
				reason: {
					name: 'reason',
					description: 'The reason for the mute'
				}
			},
			reply: '🔇 Muted {{target}} for {{duration}} minute(s). Reason: {{reason}}'
		},
		purge: {
			name: 'purge',
			description: 'Delete a number of recent messages in this channel',
			options: {
				amount: {
					name: 'amount',
					description: 'Number of messages to delete (1-100)'
				}
			},
			reply: '🧹 Deleted {{amount}} message(s).'
		},
		slowmode: {
			name: 'slowmode',
			description: 'Set slowmode for this channel',
			options: {
				seconds: {
					name: 'seconds',
					description: 'Slowmode duration in seconds (0 to disable, max 21600)'
				}
			},
			reply: '🐌 Slowmode set to {{seconds}} second(s) for this channel.',
			replyDisabled: '🐌 Slowmode disabled for this channel.'
		},
		warn: {
			name: 'warn',
			description: 'Warn a member',
			options: {
				member: {
					name: 'member',
					description: 'The member to warn'
				},
				reason: {
					name: 'reason',
					description: 'The reason for the warning'
				}
			},
			reply: '⚠️ Warned {{target}}. Reason: {{reason}}'
		},
		warnings: {
			name: 'warnings',
			description: "Show a member's warning history",
			options: {
				member: {
					name: 'member',
					description: 'The member to look up'
				}
			},
			title: "{{username}}'s warnings",
			empty: 'This member has no warnings.',
			entryName: '#{{index}} · {{date}}',
			entryValue: 'By {{moderator}} — {{reason}}'
		},
		warningsAll: {
			name: 'warnings-all',
			description: 'Show the warning history of every member in this server',
			title: 'Warnings overview',
			empty: 'No member has any warnings.',
			entry: '**{{index}}.** {{target}} — {{count}} warning(s)',
			selectPlaceholder: 'Select a member to see their warning history',
			selectOptionDescription: '{{count}} warning(s)'
		}
	},
	common: {
		yes: 'Yes',
		no: 'No'
	},
	moderation: {
		noReasonProvided: 'No reason provided'
	},
	pagination: {
		expired: '⚠️ This pagination has expired. Please run the command again.',
		notOwner: '⚠️ Only the person who ran this command can use these buttons.'
	},
	errors: {
		missingPermissions: '⚠️ I am missing the permissions required to run this command. Please check my role permissions in this server.',
		missingAccess: "⚠️ I don't have access to this channel or resource.",
		unexpected: '⚠️ Something went wrong while running this command.'
	}
};
