import { useState, useEffect } from "react"

export const useLocalStorage = (key: string, initialValue: number | string | boolean) => {
	const [state, setState] = useState(
		window.localStorage.getItem(key)
			? JSON.parse(window.localStorage.getItem(key) || "")
			: initialValue
	);
    
	useEffect(() => {
		window.localStorage.setItem(key, state);
	}, [key, state]);

	return [state, setState]
}