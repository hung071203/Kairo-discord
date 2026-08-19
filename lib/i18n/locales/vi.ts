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
		}
	},
	common: {
		yes: 'Có',
		no: 'Không'
	},
	errors: {
		missingPermissions: '⚠️ Bot không có đủ quyền để thực hiện lệnh này. Vui lòng kiểm tra lại quyền của role bot trong server.',
		missingAccess: '⚠️ Bot không có quyền truy cập kênh hoặc tài nguyên này.',
		unexpected: '⚠️ Đã xảy ra lỗi khi thực hiện lệnh này.'
	}
};
