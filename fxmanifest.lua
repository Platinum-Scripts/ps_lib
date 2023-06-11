--[[ FX Information ]]--
fx_version   'cerulean'
use_experimental_fxv2_oal 'yes'
lua54        'yes'
games        { 'rdr3', 'gta5' }
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

--[[ Resource Information ]]--
name         'ps_lib'
version      '0.0.2'
author       'Original Author: Overextended | Forked by: Platinum-Scripts'
license      'LGPL-3.0-or-later'
repository   'https://github.com/Platinum-Scripts/ps_lib'
description  'A library of shared functions to utilise in other resources.'

-- Information: ps_lib is used for Platinum Scripts releases. ps_lib is a fork of ox_lib made by Overextended. This respository will remain public in accordance with the original license.

--[[ Manifest ]]--
dependencies {
	'/server:5848',
    '/onesync',
}

ui_page 'web/build/index.html'

files {
    'init.lua',
    'imports/**/client.lua',
    'imports/**/shared.lua',
    'web/build/index.html',
    'web/build/**/*',
	'locales/*.json',
}

shared_script 'resource/init.lua'

shared_scripts {
    'resource/**/shared.lua',
    -- 'resource/**/shared/*.lua'
}

client_scripts {
	'imports/callback/client.lua',
	'imports/requestModel/client.lua',
	'imports/requestAnimDict/client.lua',
	'imports/addKeybind/client.lua',
    'resource/**/client.lua',
    'resource/**/client/*.lua'
}

server_scripts {
	'imports/callback/server.lua',
    'resource/**/server.lua',
    -- 'resource/**/server/*.lua'
}

