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
			description: 'Manage member warnings',
			add: {
				name: 'add',
				description: 'Warn a member'
			},
			list: {
				name: 'list',
				description: "Show a member's warning history"
			},
			listAll: {
				name: 'list-all',
				description: 'Show the warning history of every member in this server'
			},
			remove: {
				name: 'remove',
				description: 'Remove one or more warnings from a member'
			},
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
			title: 'Warnings overview',
			empty: 'No member has any warnings.',
			entry: '**{{index}}.** {{target}} — {{count}} warning(s)',
			selectPlaceholder: 'Select a member to see their warning history',
			selectOptionDescription: '{{count}} warning(s)'
		},
		warnRemove: {
			options: {
				member: {
					name: 'member',
					description: 'The member to remove warnings from'
				}
			},
			title: "Select warnings to remove from {{username}}",
			empty: 'This member has no warnings.',
			entry: '#{{index}} · {{date}} — {{reason}}',
			selectPlaceholder: 'Select one or more warnings to remove',
			reply: '🗑️ Removed {{count}} warning(s).'
		},
		role: {
			name: 'role',
			description: 'Add or remove roles from a member',
			add: {
				name: 'add',
				description: 'Give a role to a member',
				options: {
					member: {
						name: 'member',
						description: 'The member to give the role to'
					},
					role: {
						name: 'role',
						description: 'The role to give'
					},
					reason: {
						name: 'reason',
						description: 'The reason for adding this role'
					}
				},
				reply: '✅ Gave {{role}} to {{target}}.'
			},
			remove: {
				name: 'remove',
				description: 'Remove a role from a member',
				options: {
					member: {
						name: 'member',
						description: 'The member to remove the role from'
					},
					role: {
						name: 'role',
						description: 'The role to remove'
					},
					reason: {
						name: 'reason',
						description: 'The reason for removing this role'
					}
				},
				reply: '✅ Removed {{role}} from {{target}}.'
			}
		},
		lock: {
			name: 'lock',
			description: 'Lock a channel, preventing @everyone from sending messages',
			options: {
				channel: {
					name: 'channel',
					description: 'The channel to lock (defaults to the current channel)'
				},
				reason: {
					name: 'reason',
					description: 'The reason for locking this channel'
				}
			},
			reply: '🔒 Locked {{channel}}.'
		},
		unlock: {
			name: 'unlock',
			description: "Unlock a channel, restoring @everyone's ability to send messages",
			options: {
				channel: {
					name: 'channel',
					description: 'The channel to unlock (defaults to the current channel)'
				},
				reason: {
					name: 'reason',
					description: 'The reason for unlocking this channel'
				}
			},
			reply: '🔓 Unlocked {{channel}}.'
		},
		modlog: {
			name: 'modlog',
			description: 'Configure and view the moderation action log',
			setChannel: {
				name: 'set-channel',
				description: 'Set the channel where all moderation actions get logged',
				options: {
					channel: {
						name: 'channel',
						description: 'Channel to send all moderation action logs to'
					}
				}
			},
			setChannelReply: '✅ Moderation actions will now be logged to {{channel}}.',
			list: {
				name: 'list',
				description: 'Show the moderation action history for this server',
				options: {
					member: {
						name: 'member',
						description: 'Only show actions taken against this member (optional)'
					}
				}
			},
			listTitle: 'Moderation action log',
			listEmpty: 'No moderation actions have been logged yet.',
			entryName: '{{index}}. {{action}} — {{date}}',
			entryValue: 'Target: {{target}} · By: {{moderator}}\n> {{reason}}',
			fields: {
				target: 'Target',
				moderator: 'Moderator',
				reason: 'Reason',
				detail: 'Detail'
			},
			detail: {
				durationMinutes: '{{duration}} minute(s)'
			},
			actions: {
				kick: 'Kick',
				ban: 'Ban',
				unban: 'Unban',
				mute: 'Mute',
				roleAdd: 'Role added',
				roleRemove: 'Role removed',
				channelLock: 'Channel locked',
				channelUnlock: 'Channel unlocked',
				automodRuleCreate: 'AutoMod rule created',
				automodRuleDelete: 'AutoMod rule deleted',
				automodRuleToggle: 'AutoMod rule toggled',
				automodRuleKeywordAdd: 'AutoMod keyword added',
				automodRuleKeywordRemove: 'AutoMod keyword removed'
			}
		},
		automodRule: {
			name: 'automod-rule',
			description: 'Manage AutoMod rules for this server',
			options: {
				name: {
					name: 'name',
					description: 'A name for this rule'
				},
				alertChannel: {
					name: 'alert_channel',
					description: 'Channel to send alert logs to when this rule triggers (optional)'
				},
				timeoutMinutes: {
					name: 'timeout_minutes',
					description: 'Timeout the member for this many minutes when triggered (optional)'
				}
			},
			create: {
				name: 'create',
				description: 'Create a new AutoMod rule',
				keyword: {
					name: 'keyword',
					description: 'Block messages containing specific keywords',
					options: {
						keywords: {
							name: 'keywords',
							description: 'Comma-separated keywords to block'
						}
					}
				},
				preset: {
					name: 'preset',
					description: "Block messages using Discord's built-in word lists",
					options: {
						profanity: {
							name: 'profanity',
							description: 'Block profanity/cursing (default: on)'
						},
						sexualContent: {
							name: 'sexual_content',
							description: 'Block sexually explicit content (default: on)'
						},
						slurs: {
							name: 'slurs',
							description: 'Block slurs/hate speech (default: on)'
						}
					}
				},
				mentionSpam: {
					name: 'mention-spam',
					description: 'Block messages that mention too many users/roles',
					options: {
						mentionLimit: {
							name: 'mention_limit',
							description: 'Max mentions allowed per message (1-50)'
						},
						raidProtection: {
							name: 'raid_protection',
							description: 'Automatically detect mention raids (default: on)'
						}
					}
				},
				spam: {
					name: 'spam',
					description: "Block messages Discord's spam classifier detects as spam"
				},
				memberProfile: {
					name: 'member-profile',
					description: 'Block members whose nickname/bio contains specific keywords',
					options: {
						keywords: {
							name: 'keywords',
							description: 'Comma-separated keywords to block'
						}
					}
				}
			},
			list: {
				name: 'list',
				description: 'List all AutoMod rules in this server'
			},
			delete: {
				name: 'delete',
				description: 'Delete one or more AutoMod rules'
			},
			addKeyword: {
				name: 'add-keyword',
				description: 'Add keywords to an existing keyword rule',
				options: {
					ruleName: {
						name: 'rule_name',
						description: 'Name of the existing keyword rule to add to'
					},
					keywords: {
						name: 'keywords',
						description: 'Comma-separated keywords to add to the rule'
					}
				}
			},
			removeKeyword: {
				name: 'remove-keyword',
				description: 'Remove keywords from an existing keyword rule',
				options: {
					ruleName: {
						name: 'rule_name',
						description: 'Name of the existing keyword rule to remove from'
					},
					keywords: {
						name: 'keywords',
						description: 'Comma-separated keywords to remove from the rule'
					}
				}
			},
			toggle: {
				name: 'toggle',
				description: 'Enable or disable a rule',
				options: {
					ruleName: {
						name: 'rule_name',
						description: 'Name of the rule to enable/disable'
					}
				}
			},
			view: {
				name: 'view',
				description: 'View the full details of a rule',
				options: {
					ruleName: {
						name: 'rule_name',
						description: 'Name of the rule to view'
					}
				},
				fields: {
					trigger: 'Trigger type',
					status: 'Status',
					keywords: 'Keywords',
					presets: 'Preset word lists',
					mentionLimit: 'Mention limit',
					raidProtection: 'Raid protection',
					alertChannel: 'Alert channel',
					timeout: 'Timeout'
				},
				noneValue: 'None'
			},
			timeoutMinutesValue: '{{minutes}} minute(s)',
			presetLabels: {
				profanity: 'Profanity',
				sexualContent: 'Sexual content',
				slurs: 'Slurs'
			},
			createdReply: '✅ Created AutoMod rule **{{name}}**.',
			listTitle: 'AutoMod rules',
			listEmpty: 'This server has no AutoMod rules yet.',
			listEntry: '**{{index}}. {{name}}** — {{trigger}} · {{status}}',
			deleteTitle: 'Select rules to delete',
			deleteSelectPlaceholder: 'Select one or more rules to delete',
			deleteReply: '🗑️ Deleted {{count}} rule(s).',
			addKeywordReply: '✅ Added {{count}} keyword(s) to **{{name}}**.',
			removeKeywordReply: '✅ Removed {{count}} keyword(s) from **{{name}}**.',
			toggleEnabledReply: '✅ Enabled rule **{{name}}**.',
			toggleDisabledReply: '✅ Disabled rule **{{name}}**.',
			ruleNotFoundReply: '❌ No keyword rule named **{{name}}** was found.',
			ruleNotFoundAnyReply: '❌ No rule named **{{name}}** was found.',
			status: {
				enabled: 'Enabled',
				disabled: 'Disabled'
			},
			triggers: {
				keyword: 'Keyword',
				preset: 'Preset word list',
				mentionSpam: 'Mention spam',
				spam: 'Spam',
				memberProfile: 'Member profile keyword'
			}
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
