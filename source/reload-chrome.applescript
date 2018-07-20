tell application "Google Chrome"
	repeat with thisWindow in windows
		if get (count every tab of thisWindow) ≤ 1 then
			if thisWindow's active tab's URL does not start with "chrome-devtools" then
				execute thisWindow's active tab javascript "window.location.reload();"
			end if
		end if
	end repeat
end tell
