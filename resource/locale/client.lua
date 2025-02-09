
RegisterNUICallback("init", function(_, cb)
	cb(1)
	SendNUIMessage(
			{
		action = "loadLocales",
		data = {}
	})
	local JSON = LoadResourceFile(cache.resource, ("locales/%s.json"):format(GetConvar("ox:locale", "en"))) or LoadResourceFile(cache.resource, "locales/en.json")
	SendNUIMessage(
			{
		action = "setLocale",
		data = JSON and json.decode(JSON) or {}
	})
end)

RegisterNUICallback("PLAY_SOUND_FRONTEND", function(data, cb)
	PlaySoundFrontend(- 1, data.audioName, data.audioRef, false)
	cb("ok")
end)