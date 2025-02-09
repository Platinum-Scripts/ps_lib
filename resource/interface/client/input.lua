local input

---@class InputDialogRowProps
---@field type 'input' | 'number' | 'checkbox' | 'select' | 'slider' | 'multi-select' | 'date' | 'date-range' | 'time' | 'textarea'
---@field label string
---@field options? { value: string, label: string, default?: string }[]
---@field password? boolean
---@field icon? string | {[1]: IconProp, [2]: string};
---@field iconColor? string
---@field placeholder? string
---@field default? string | number
---@field disabled? boolean
---@field checked? boolean
---@field min? number
---@field max? number
---@field step? number
---@field autosize? boolean
---@field required? boolean
---@field format? string
---@field clearable? string
---@field description? string

---@class InputDialogOptionsProps
---@field allowCancel? boolean
---@field onRowUpdate? function(data: any): void

---@param heading string
---@param rows string[] | InputDialogRowProps[]
---@param options InputDialogOptionsProps[]?
---@return string[] | number[] | boolean[] | nil
local resName = GetCurrentResourceName()
local lastId = 0
function lib.inputDialog(heading, rows, options)
	if input then
		return
	end
	input = promise.new()
	options = options or {}

	-- Backwards compat with string tables
	for i = 1, #rows do
		if type(rows[i]) == "string" then
			rows[i] = {
				type = "input",
				label = rows[i]
			}
		end
	end

	local rawOptions = {[1] = options.onRowUpdate}

	if options and options.onRowUpdate then
		options.onRowUpdate = true
		options.cbe = "onRowUpdate:" .. resName .. ":" .. lastId
	end

	RegisterNUICallback(
		"onRowUpdate:" .. resName .. ":" .. lastId,
		function(data, cb)
			if cb then
				pcall(cb, 1)
			end

			if rawOptions and rawOptions[1] then
				rawOptions[1](data)
			end
		end
	)

	lib.setNuiFocus(false)
	SendNUIMessage(
		{
			action = "openDialog",
			data = {
				heading = heading,
				rows = rows,
				options = options
			}
		}
	)

	lastId = lastId + 1

	return Citizen.Await(input)
end

function lib.closeInputDialog()
	if not input then
		return
	end

	lib.resetNuiFocus()
	SendNUIMessage(
		{
			action = "closeInputDialog"
		}
	)

	input:resolve(nil)
	input = nil
end

RegisterNUICallback(
	"inputData",
	function(data, cb)
		cb(1)
		lib.resetNuiFocus()
		local promise = input
		input = nil
		promise:resolve(data)
	end
)