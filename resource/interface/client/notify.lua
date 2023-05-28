---@alias NotificationPosition 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left'
---@alias NotificationType 'info' | 'warning' | 'success' | 'error'

---@class NotifyProps
---@field id? string
---@field title? string
---@field description? string
---@field duration? number
---@field position? NotificationPosition
---@field type? NotificationType
---@field style? { [string]: any }
---@field icon? string | {[1]: IconProp, [2]: string};
---@field iconColor? string;

local resName = GetCurrentResourceName()
local ids = {
	1, 2, 3
}
local lastId = 0

---@param data NotifyProps
function lib.notify(data)
	if not data.id then
		lastId = lastId + 1
		if lastId > #ids then
			lastId = 1
		end
		data.id = resName .. ":id#" .. ids[lastId]
	end

	SendNUIMessage(
		{
		action = "notify",
		data = data
	})
end

---@class DefaultNotifyProps
---@field title? string
---@field description? string
---@field duration? number
---@field position? NotificationPosition
---@field status? 'info' | 'warning' | 'success' | 'error'
---@field id? number

---@param data DefaultNotifyProps
function lib.defaultNotify(data)
	if not data.id then
		lastId = lastId + 1
		if lastId > #ids then
			lastId = 1
		end
		data.id = resName .. ":id#" .. ids[lastId]
	end
	
	-- Backwards compat for v3
	data.type = data.status
	if data.type == "inform" then
		data.type = "info"
	end
	return lib.notify(data)
end

RegisterNetEvent("ps_lib:notify", lib.notify)
RegisterNetEvent("ps_lib:defaultNotify", lib.defaultNotify)