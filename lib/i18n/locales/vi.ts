export default {
	commands: {
		ping: {
			name: 'ping',
			description: 'Phản hồi Pong!',
			reply: 'Pong! Độ trễ: {{latency}}ms'
		},
		userinfo: {
			name: 'userinfo',
			description: 'Xem thông tin của một thành viên',
			options: {
				member: {
					name: 'member',
					description: 'Thành viên cần xem thông tin'
				}
			},
			fields: {
				nickname: 'Biệt danh',
				joinedAt: 'Tham gia server',
				createdAt: 'Tạo tài khoản',
				roles: 'Vai trò',
				noRoles: 'Không có vai trò nào'
			}
		},
		serverinfo: {
			name: 'serverinfo',
			description: 'Xem thông tin của server',
			fields: {
				name: 'Tên',
				id: 'ID',
				owner: 'Chủ server',
				createdAt: 'Ngày tạo',
				members: 'Thành viên',
				roles: 'Vai trò',
				channels: 'Kênh'
			}
		},
		avatar: {
			name: 'avatar',
			description: 'Xem avatar của một user',
			options: {
				user: {
					name: 'user',
					description: 'User cần xem avatar'
				}
			},
			title: 'Avatar của {{username}}'
		},
		help: {
			name: 'help',
			description: 'Xem danh sách các lệnh',
			title: 'Danh sách lệnh'
		},
		uptime: {
			name: 'uptime',
			description: 'Xem bot đã hoạt động bao lâu',
			reply: 'Bot đã hoạt động từ {{timestamp}}'
		},
		roleinfo: {
			name: 'roleinfo',
			description: 'Xem thông tin của một role',
			options: {
				role: {
					name: 'role',
					description: 'Role cần xem thông tin'
				}
			},
			fields: {
				id: 'ID',
				color: 'Màu',
				position: 'Vị trí',
				members: 'Thành viên',
				mentionable: 'Có thể mention',
				hoisted: 'Hiển thị riêng',
				createdAt: 'Ngày tạo'
			}
		},
		channelinfo: {
			name: 'channelinfo',
			description: 'Xem thông tin của một channel',
			options: {
				channel: {
					name: 'channel',
					description: 'Channel cần xem thông tin'
				}
			},
			fields: {
				id: 'ID',
				type: 'Loại',
				category: 'Danh mục',
				topic: 'Chủ đề',
				createdAt: 'Ngày tạo'
			},
			types: {
				text: 'Văn bản',
				voice: 'Voice',
				category: 'Danh mục',
				announcement: 'Thông báo',
				forum: 'Forum',
				stage: 'Stage'
			}
		},
		invite: {
			name: 'invite',
			description: 'Tạo link mời cho channel này',
			reply: 'Đây là link mời của bạn: {{url}}'
		},
		kick: {
			name: 'kick',
			description: 'Kick một thành viên khỏi server',
			options: {
				member: {
					name: 'member',
					description: 'Thành viên cần kick'
				},
				reason: {
					name: 'reason',
					description: 'Lý do kick'
				}
			},
			reply: '👢 Đã kick {{target}}. Lý do: {{reason}}'
		},
		ban: {
			name: 'ban',
			description: 'Cấm một user khỏi server',
			options: {
				user: {
					name: 'user',
					description: 'User cần cấm'
				},
				reason: {
					name: 'reason',
					description: 'Lý do cấm'
				},
				deleteMessageSeconds: {
					name: 'delete_message_seconds',
					description: 'Xóa tin nhắn của user này trong X giây gần nhất (tối đa 7 ngày)'
				}
			},
			reply: '🔨 Đã cấm {{target}}. Lý do: {{reason}}'
		},
		unban: {
			name: 'unban',
			description: 'Gỡ cấm một user khỏi server',
			options: {
				user: {
					name: 'user',
					description: 'User cần gỡ cấm'
				},
				reason: {
					name: 'reason',
					description: 'Lý do gỡ cấm'
				}
			},
			reply: '✅ Đã gỡ cấm {{target}}. Lý do: {{reason}}'
		},
		mute: {
			name: 'mute',
			description: 'Mute tạm thời một thành viên',
			options: {
				member: {
					name: 'member',
					description: 'Thành viên cần mute'
				},
				duration: {
					name: 'duration',
					description: 'Thời gian mute tính bằng phút (tối đa 40320, 28 ngày)'
				},
				reason: {
					name: 'reason',
					description: 'Lý do mute'
				}
			},
			reply: '🔇 Đã mute {{target}} trong {{duration}} phút. Lý do: {{reason}}'
		},
		purge: {
			name: 'purge',
			description: 'Xóa một số tin nhắn gần nhất trong channel này',
			options: {
				amount: {
					name: 'amount',
					description: 'Số tin nhắn cần xóa (1-100)'
				}
			},
			reply: '🧹 Đã xóa {{amount}} tin nhắn.'
		},
		slowmode: {
			name: 'slowmode',
			description: 'Đặt slowmode cho channel này',
			options: {
				seconds: {
					name: 'seconds',
					description: 'Thời gian slowmode tính bằng giây (0 để tắt, tối đa 21600)'
				}
			},
			reply: '🐌 Đã đặt slowmode {{seconds}} giây cho channel này.',
			replyDisabled: '🐌 Đã tắt slowmode cho channel này.'
		},
		warn: {
			name: 'warn',
			description: 'Cảnh cáo một thành viên',
			options: {
				member: {
					name: 'member',
					description: 'Thành viên cần cảnh cáo'
				},
				reason: {
					name: 'reason',
					description: 'Lý do cảnh cáo'
				}
			},
			reply: '⚠️ Đã cảnh cáo {{target}}. Lý do: {{reason}}'
		},
		warnings: {
			name: 'warnings',
			description: 'Xem lịch sử cảnh cáo của một thành viên',
			options: {
				member: {
					name: 'member',
					description: 'Thành viên cần xem lịch sử'
				}
			},
			title: 'Lịch sử cảnh cáo của {{username}}',
			empty: 'Thành viên này chưa có cảnh cáo nào.',
			entryName: '#{{index}} · {{date}}',
			entryValue: 'Bởi {{moderator}} — {{reason}}'
		},
		warningsAll: {
			name: 'warnings-all',
			description: 'Xem lịch sử cảnh cáo của tất cả thành viên trong server',
			title: 'Tổng hợp cảnh cáo',
			empty: 'Chưa có thành viên nào bị cảnh cáo.',
			entry: '**{{index}}.** {{target}} — {{count}} lần cảnh cáo',
			selectPlaceholder: 'Chọn một thành viên để xem lịch sử cảnh cáo',
			selectOptionDescription: '{{count}} lần cảnh cáo'
		},
		warnRemove: {
			name: 'warn-remove',
			description: 'Xóa một hoặc nhiều cảnh cáo của một thành viên',
			options: {
				member: {
					name: 'member',
					description: 'Thành viên cần xóa cảnh cáo'
				}
			},
			title: 'Chọn cảnh cáo cần xóa của {{username}}',
			empty: 'Thành viên này chưa có cảnh cáo nào.',
			entry: '#{{index}} · {{date}} — {{reason}}',
			selectPlaceholder: 'Chọn một hoặc nhiều cảnh cáo cần xóa',
			reply: '🗑️ Đã xóa {{count}} cảnh cáo.'
		}
	},
	common: {
		yes: 'Có',
		no: 'Không'
	},
	moderation: {
		noReasonProvided: 'Không có lý do'
	},
	pagination: {
		expired: '⚠️ Phiên xem trang này đã hết hạn. Vui lòng chạy lại lệnh.',
		notOwner: '⚠️ Chỉ người đã chạy lệnh này mới có thể dùng các nút này.'
	},
	errors: {
		missingPermissions: '⚠️ Bot không có đủ quyền để thực hiện lệnh này. Vui lòng kiểm tra lại quyền của role bot trong server.',
		missingAccess: '⚠️ Bot không có quyền truy cập kênh hoặc tài nguyên này.',
		unexpected: '⚠️ Đã xảy ra lỗi khi thực hiện lệnh này.'
	}
};
