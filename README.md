Information:
ps_lib is used for Platinum Scripts releases. ps_lib is a fork of ox_lib made by Overextended. This respository will remain public in accordance with the original license.

---

<div align='center'><h1><a href='https://overextended.github.io/docs/'>Documentation</a></h3></div>
<br>

## Lua Library for FiveM

FXServer provides its own system for including files, which we use to load this resource in the fxmanifest via

```lua
shared_script '@ps_lib/init.lua'
```

### server.cfg

```
add_ace resource.ps_lib command.add_ace allow
add_ace resource.ps_lib command.remove_ace allow
add_ace resource.ps_lib command.add_principal allow
add_ace resource.ps_lib command.remove_principal allow
```

## License

<a href='https://www.gnu.org/licenses/lgpl-3.0.en.html'>LGPL-3.0-or-later</a>
