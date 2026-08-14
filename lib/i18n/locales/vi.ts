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
		}
	},
	errors: {
		missingPermissions: '⚠️ Bot không có đủ quyền để thực hiện lệnh này. Vui lòng kiểm tra lại quyền của role bot trong server.',
		missingAccess: '⚠️ Bot không có quyền truy cập kênh hoặc tài nguyên này.',
		unexpected: '⚠️ Đã xảy ra lỗi khi thực hiện lệnh này.'
	}
};
